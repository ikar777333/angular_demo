import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store'
import { Load } from "../../models/Load";
import { Node } from "../../models/diagram/Node";
import { ChangeLoadState } from "../../store/actions/loads"
import * as fromRoot from '../../store/reducers';
import { LoadDialogComponent } from "../LoadDialog/LoadDialog.component"
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component"
import * as d3 from 'd3';

enum Orientation {
  TOP_TO_BOTTOM,
  BOTTOM_TO_TOP
}

let NODE_WIDTH:  number = 50;
let NODE_HEIGTH: number = 24;

class Tree {
  treeBottom: any;
  treeTop:    any;

  constructor(treeBottom, treeTop) {
    this.treeBottom = treeBottom;
    this.treeTop =    treeTop;
  }

  public links() {
    return this.treeBottom.links()/*.concat(this.treeTop.links());*/
  }

  public descendants() {
    return this.treeBottom.descendants()/*.concat(this.treeTop.descendants()
      .filter(function(element){return !element.data.load || element.data.load.$isBusbar !== true && element.data.load.$isSupply === true;}));*/
  }
}

@Component({
  selector: 'app-diagram',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {

  private margin = {top: 40, right: 0, bottom: 50, left: 0};
  private width:      number;
  private height:     number;
  private treeWidth:  number;
  private treeHeight: number;
  private oldX:       number;
  private oldY:       number;
  private svg:        any;
  private g:          any;
  private treemap:    any;
  private tree:       Tree;
  private nodesForSerch: Array<any>;
  private allocatedLoads:       Array<Load>;
  private notAllocatedLoads:    Array<Load>;
  private supplyAllocatedLoads: Array<Load>;

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) { 

    store.select(fromRoot.getAllocatedLoads).subscribe(data => {
      this.allocatedLoads = data}
    );

    store.select(fromRoot.getNotAllocatedLoads).subscribe(data => {
      this.notAllocatedLoads = data}
    );

    store.select(fromRoot.getSupplyAllocatedLoads).subscribe(data => {
      this.supplyAllocatedLoads = data}
    );

    this.width =      925 - this.margin.left - this.margin.right;
    this.height =     500 - this.margin.top - this.margin.bottom;
    this.treeWidth =  this.width;
    this.treeHeight = this.height;
    this.treemap =    d3.tree().size([this.treeWidth, this.treeHeight]);
  }

  ngOnInit() {
    this.initSvg();
    this.initData();
    this.initLinks();
    this.initNodes();
    this.initZoom();
    this.initDrugAndDrop();
  }

  private initData() {
    let root:     any = { children: [] };
    let rootTop:  any = { children: [] };

    let supplyAllocatedNodes = this.supplyAllocatedLoads.map(function(element){return new Node(element)})
    let allocatedNodes = this.allocatedLoads.map(function(element){return new Node(element)})
    allocatedNodes.forEach(busbar => {
      busbar.children = busbar.children.concat(supplyAllocatedNodes.filter(function(element){
        return element.load.$parentId === busbar.load.$id}
      ));
    });

    root.children = root.children.concat(allocatedNodes)
    root.children = root.children.concat(this.notAllocatedLoads.map(function(element){return new Node(element)}));
    root = d3.hierarchy(root)
    root = this.treemap(root)
    this.tree = new Tree(root, rootTop);
    this.updateTreeSize(this.tree)
    this.searchLoad("");
  }

  private updateTreeSize(tree: Tree) {
    let maxDepth =    Math.max.apply(Math, tree.descendants().map(function(e) { return e.depth; }));
    this.treeWidth =  this.width + 200;
    this.treeHeight = this.height + (maxDepth * (NODE_HEIGTH * 3))
    this.treemap =    d3.tree().size([this.treeWidth, this.treeHeight]);
  }

  private initSvg() {
    this.svg = d3.select("svg")
      .attr("width", this.width)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append("g")
  }

  private initLinks() {

    this.g.selectAll('.link').remove();
    this.g.selectAll('.rootLink').remove();
    this.g.selectAll('.pathLabel').remove();
    this.g.selectAll('.rootPathLabel').remove();

    this.g.selectAll(".link")
      .data(this.tree.links())
      .enter()
      .append('path')
      .attr("class", function(d) {return d.source.data.load ? "link" : "rootLink"})
      .attr("id", function(d,i){return 'path'+i})
      .attr("d", (d) => {
          return this.getOrientationForLink(d, Orientation.TOP_TO_BOTTOM)
      })
      .attr('id', function(d,i) {return 'path'+i});

    var pathlabels = this.g.selectAll(".pathLabel")
      .data(this.tree.links())
      .enter()
      .append('text')
      .attr("class", function(d) {return d.source.data.load ? "pathLabel" : "rootPathLabel"})
      .attr("id", function(d,i){return 'pathLabel'+ i})
      .attr("dx", 40)
      .attr("dy", 0)
  
    pathlabels.append('textPath')
      .attr('xlink:href',function(d,i) {return '#path'+i})
      .text('+')
      .on('click', (d) => {
        this.moveLoadToNotAllocatedLoads(d);
      });
  }

  private updateLinks() {
    this.g.selectAll(".link")
    .attr("d", (d) => {
        return this.getOrientationForLink(d, Orientation.TOP_TO_BOTTOM)
    })
  }

  private initNodes() {

    this.g.selectAll('.node').remove();
    this.g.selectAll('.rootNode').remove();
    this.g.selectAll('.nodeSupply').remove();
    this.g.selectAll('.nodeBusbar').remove();

    var node = this.g.selectAll(".node")
    .data(this.tree.descendants())
    .enter().append("g")
    .attr("class", function(d) { 
      if(!d.data.load) {
        return " rootNode";
      } else if (d.data.load.$isSupply) {
        return " nodeSupply"
      } else if (d.data.load.$isBusbar) {
        return " nodeBusbar"
      } else {
        return " node"
      }})
    .attr("transform", (d) => { 
      return this.getOrientationForNode(d, Orientation.TOP_TO_BOTTOM);  
    });

    node.append("rect")
      .attr("width", NODE_WIDTH)
      .attr("height", NODE_HEIGTH)
      .on('click', (d) => {
        this.openLoadDialog(d.data.load);})

    node.append("text")
      .attr("x", (d) => { return NODE_WIDTH / 2 })
      .attr("y", (d) => { return NODE_HEIGTH / 2 })
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.load ? d.data.load.$name : "" })
      .on('click', (d) => {
        this.openLoadDialog(d.data.load);});

    node.exit().attr("transform", function(d) {
      return "translate(" + d.parent.y + "," + d.parent.x + ")";
    }).remove();
  }

  private updateNodes() {
    this.g.selectAll([".node", ".nodeSupply"])
    .attr("transform", (d) => { 
        return this.getOrientationForNode(d, Orientation.TOP_TO_BOTTOM);  
    });
  }

  private getOrientationForNode(d: any, orientation: Orientation) {

    let x, y;

    switch(orientation) {
      case Orientation.TOP_TO_BOTTOM: {
        x = d.x;
        y = d.y; 
        break;
      }
      case Orientation.BOTTOM_TO_TOP: {
        x = d.x;
        y = this.height / 2 - (d.y - (-NODE_HEIGTH*3));
        break;
      }
      default: {
        x = d.x;
        y = d.y;
        break;
      }
    }

    return "translate(" + x + "," + y + ")"
  }

  private getOrientationForLink(d: any, orientation: Orientation) {

    let targetX, targetY, sourceX, sourceY;

    switch(orientation) {
      case Orientation.BOTTOM_TO_TOP: {
        targetX = d.target.x + (NODE_WIDTH / 2);
        targetY = this.height /2 - (d.target.y - (-NODE_HEIGTH * 2.5)) ;
        sourceX = d.source.x + (NODE_WIDTH / 2);
        sourceY = this.height /2 - (d.source.y - (-NODE_HEIGTH * 2.5)) ;
        break;
      }
      case Orientation.TOP_TO_BOTTOM: {
        targetX = d.target.x + (NODE_WIDTH / 2);
        targetY = d.target.y + NODE_HEIGTH;
        sourceX = d.source.x + (NODE_WIDTH / 2);
        sourceY = d.source.y + NODE_HEIGTH;
        break;
      }
      default: {
        targetX = d.target.x + (NODE_WIDTH / 2);
        targetY = d.target.y + NODE_HEIGTH;
        sourceX = d.source.x + (NODE_WIDTH / 2);
        sourceY = d.source.y + NODE_HEIGTH;
        break;
      }
    }

    return  "M" + sourceX + "," + sourceY
          + "C" + sourceX + "," + (sourceY + targetY) / 2
          + " " + targetX + "," + (sourceY + targetY) / 2
          + " "+  targetX + "," + targetY;
  } 

  private moveLoadToNotAllocatedLoads(d: any) {
    let load = d.target.data.load
    let newLoad = new Load(
      load.$id,
      load.$name,
      load.$area,
      load.$purpose,
      load.$subPurpose,
      load.$loadType,
      load.$childrenLoads,
      null,
      load.$isBusbar
    )
    this.store.dispatch(new ChangeLoadState({oldLoad: load, newLoad: newLoad}))
    d3.select(d3.event.target.attributes["href"].nodeValue).remove();
    d.target.data.load = newLoad;
  }

  private updateDiagram() {
    this.initData();
    this.initLinks();
    this.initNodes();
    this.initDrugAndDrop();
  }

  private getNodesForSerch() {
    return this.nodesForSerch;
  }

  private focus(loadId: number) {
    let node = this.tree.descendants().find(function(element) {
      return element.data.load ? element.data.load.$id === loadId : false;
    })
    this.g.attr("transform", "translate(" + -(node.x - 420) + "," + -(node.y - 250) + ")")
  }

  private searchLoad(value: string) {
    this.nodesForSerch = this.tree.descendants().filter(function(element) {
      return  element.data.load && element.data.load.$name.includes(value);
    })
  }

  private openLoadDialog(load: Load): void {
    const dialogRef = this.dialog.open(LoadDialogComponent, {
      width: '450px',
      data: load
    });
    dialogRef.afterClosed().subscribe(result => {
      this.updateDiagram();
    });
  }

  private openErrorDialog(message: string): void{
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '450px',
      data: message
    });
  }

  private initZoom() {
    let g = this.g;
    this.svg.call(
      d3.zoom()
      .on("zoom", function () {
        g.attr("transform", d3.event.transform)
    }));
  }

  private initDrugAndDrop() {
    this.svg.selectAll([".node", ".nodeSupply"]).call(d3.drag()
    .on("start", (d: any) => {
      this.oldX = d.x;
      this.oldY = d.y;
    })
    .on("drag", function(d: any) {
      d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")");
    })
    .on("end", (d: any) => {
        let node = this.overlay(d);
        if(this.isValide(d, node)) {
          let load = d.data.load;
          let newLoad = new Load(
            load.$id,
            load.$name,
            load.$area,
            load.$purpose,
            load.$subPurpose,
            load.$loadType,
            load.$childrenLoads,
            node.data.load.$id,
            load.$isBusbar
          )
          this.store.dispatch(new ChangeLoadState({oldLoad: load, newLoad: newLoad}))
          this.updateDiagram();
        } else {
          d.x = this.oldX;
          d.y = this.oldY;
          this.updateNodes();
        }
    })
    .on("start.render drag.render end.render", (d) => {  
        this.updateLinks()
    }));
  }

  private isValide(d, node) {
    if(node === undefined)
      return false;
    var load = d.data.load;
    var load2 = node.data.load;
    if(load.$parentId !== null){
      this.openErrorDialog("err1")
      return false;
    } else if (load2.$parentId === null && !load2.$isBusbar) {
      this.openErrorDialog("err2")
      return false;
    } else if (load2.$isSupply) {
      this.openErrorDialog("err3")
      return false;
    } else if (load.$isSupply && !load2.$isBusbar) {
      this.openErrorDialog("err4")
      return false;
    }
    return true;
  }

  private overlay(d) {
    let nodes = this.tree.descendants().filter(function(element) {
      return element.data.load && element.data.load.$name !== d.data.load.$name;
    })

    return nodes.find(function(element){
      let x = Math.abs(d.x - element.x);
      let y = Math.abs(d.y - element.y);

      if((x < NODE_WIDTH) && (y < NODE_HEIGTH))
        return true;
      else 
        return false;
    })
  }

}

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store'
import { Load } from "../../models/Load";
import { Node } from "../../models/diagram/Node";
import { LoadTypes } from "../../models/LoadTypes.enum"
import { ChangeLoadState } from "../../store/actions/loads"
import * as fromRoot from '../../store/reducers';
import { LoadDialogComponent } from "../LoadDialog/LoadDialog.component"
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component"
import * as d3 from 'd3';

enum Orientation {
  TOP_TO_BOTTOM,
  BOTTOM_TO_TOP
}

class Tree {
  treeBottom: any;
  treeTop:    any;

  constructor(treeBottom, treeTop) {
    this.treeBottom = treeBottom;
    this.treeTop =    treeTop;
    this.treeTop.links().forEach(function(element) {
      element.y = element.depth * 180;
    })
  }

  public links() {
    return this.treeBottom.links().concat(this.treeTop.links());
  }

  public descendants() {
    return this.treeBottom.descendants().concat(this.treeTop.descendants()
      .filter(function(element){return !element.data.load || element.data.load && element.data.load.$isBusbar !== true;}));
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
  private NODE_WIDTH:  number = 50;
  private NODE_HEIGTH: number = 24;
  private width:     number;
  private height:    number;
  private oldX:      number;
  private oldY:      number;
  private svg:       any;
  private g:         any;
  private treemap:   any;
  private tree:      Tree;
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

    this.width = 925 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.treemap = d3.tree().size([this.width, this.height]);
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
    allocatedNodes = allocatedNodes.map(function(busbar) { 
      busbar.children = supplyAllocatedNodes.filter(function(element){
        return element.load.$parentId === busbar.load.$id}
      );
      return busbar;
    })

    root.children = root.children.concat(this.allocatedLoads.map(function(element){return new Node(element)}));
    root.children = root.children.concat(this.notAllocatedLoads.map(function(element){return new Node(element)}));
    root = d3.hierarchy(root)
    root = this.treemap(root)

    rootTop.children = allocatedNodes;
    rootTop.children = rootTop.children.concat(this.notAllocatedLoads.map(function(element){return new Node(element)}));
    rootTop = d3.hierarchy(rootTop);
    rootTop = this.treemap(rootTop);

    this.tree = new Tree(root, rootTop);
  }

  private initSvg() {
    this.svg = d3.select("svg")
      .attr("width", "100%")
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
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
        if(d.target.data.load.$isSupply && d.target.data.load.parentId !== null)
          return this.getOrientationForLink(d, Orientation.BOTTOM_TO_TOP)
        else 
          return this.getOrientationForLink(d, Orientation.TOP_TO_BOTTOM)
      })
      .attr('id', function(d,i) {return 'path'+i});

    var pathlabels = this.g.selectAll(".pathLabel")
      .data(this.tree.links())
      .enter()
      .append('text')
      .attr("class", function(d) {return d.source.data.load ? "pathLabel" : "rootPathLabel"})
      .attr("id", function(d,i){return 'pathLabel'+i})
      .attr("dx", 10)
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
      if(d.target.data.load.$isSupply && d.target.data.load.parentId !== null)
        return this.getOrientationForLink(d, Orientation.BOTTOM_TO_TOP)
      else 
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
      if(d.data.load && d.data.load.$isSupply) 
        return this.getOrientationForNode(d, Orientation.BOTTOM_TO_TOP);
      else 
        return this.getOrientationForNode(d, Orientation.TOP_TO_BOTTOM);  
    });

    node.append("rect")
      .attr("width", this.NODE_WIDTH)
      .attr("height", this.NODE_HEIGTH)
      .on('click', (d) => {
        this.openLoadDialog(d.data.load);})

    node.append("text")
      .attr("x", function(d) { return 25 })
      .attr("y", function(d) { return 14 })
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
      if(d.data.load && d.data.load.$isSupply) 
        return this.getOrientationForNode(d, Orientation.BOTTOM_TO_TOP);
      else 
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
        y = this.height - (d.y - (-this.NODE_HEIGTH * 3));
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
        targetX = d.target.x + (this.NODE_WIDTH / 2);
        targetY = this.height - (d.target.y - (-this.NODE_HEIGTH * 3)) ;
        sourceX = d.source.x + (this.NODE_WIDTH / 2);
        sourceY = this.height - (d.source.y - (-this.NODE_HEIGTH * 3)) ;
        break;
      }
      case Orientation.TOP_TO_BOTTOM: {
        targetX = d.target.x + (this.NODE_WIDTH / 2);
        targetY = d.target.y + this.NODE_HEIGTH;
        sourceX = d.source.x + (this.NODE_WIDTH / 2);
        sourceY = d.source.y + this.NODE_HEIGTH;
        break;
      }
      default: {
        targetX = d.target.x + (this.NODE_WIDTH / 2);
        targetY = d.target.y + this.NODE_HEIGTH;
        sourceX = d.source.x + (this.NODE_WIDTH / 2);
        sourceY = d.source.y + this.NODE_HEIGTH;
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
  }

  private updateDiagram() {
    this.initData();
    this.initLinks();
    this.initNodes();
    this.initDrugAndDrop();
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
    this.svg.selectAll(".node").call(d3.drag()
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

      if((x < 50) && (y < 24))
        return true;
      else 
        return false;
    })
  }

}

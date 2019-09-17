import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store'
import { Load } from "../../models/Load";
import { Node } from "../../models/diagram/Node";
import { LoadTypes } from "../../models/LoadTypes.enum"
import { ChangeLoadState } from "../../store/actions/loads"
import * as fromRoot from '../../store/reducers';
import { LoadDialogComponent } from "../LoadDialog/LoadDialog.component"
import { ChooseBusbarDialogComponent } from "../ChooseBusbarDialog/ChooseBusbarDialog.component"

import * as d3 from 'd3';


@Component({
  selector: 'app-diagram',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {

  private margin = {top: 40, right: 0, bottom: 50, left: 0};
  private width: number;
  private height: number;
  private svg: any;
  private g: any;
  private tree: any;
  private nodes: any;
  private allocatedLoads : Array<Load>;
  private notAllocatedLoads : Array<Load>;
  private supplyAllocatedLoads : Array<Load>;
  private treeData: Array<Node> = [];

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

    this.width = 660 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.tree = d3.tree().size([this.width, this.height]);
  }

  ngOnInit() {
    this.initSvg();
    this.initData();
    this.initLinks();
    this.initTest();
    this.initNodes();
    this.initZoom();
    this.initDrugAndDrop();
  }

  private initData() {

    let root = { children: [] };

    root.children = root.children.concat(this.notAllocatedLoads.map(function(element){return new Node(element)}));
    root.children = root.children.concat(this.allocatedLoads.map(function(element){return new Node(element)}));
    root.children = root.children.concat(this.supplyAllocatedLoads.map(function(element){return new Node(element)}));

    this.nodes = d3.hierarchy(root)
    this.nodes = this.tree(this.nodes); 
  }

  private initSvg() {
    this.svg = d3.select("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private initLinks() {
    this.g.selectAll(".link")
      .data(this.nodes.links(this.nodes))
      .enter()
      .append('path')
      .attr("class", "link")
      .attr("id", function(d,i){return 'path'+i})
      .attr("d", function(d) {
        return "M" + (d.source.x + 25) + "," + (d.source.y + 24)
        + "C" + (d.source.x + 25) + "," + (d.source.y + d.target.y) / 2
        + " " + (d.target.x + 25) + "," +  (d.source.y + d.target.y) / 2
        + " "+ (d.target.x + 25) + "," + d.target.y;
      })
      .attr('id', function(d,i) {return 'path'+i})
  }

  private initTest() {

    var pathlabels = this.g.selectAll(".pathLabel")
    .data(this.nodes.links(this.nodes))
    .enter()
    .append('text')
    .attr("class", "pathLabel")
    .attr("class", "pathLabel")
    .attr("id", function(d,i){return 'pathLabel'+i})
    .attr("dx", 75)
    .attr("dy", 0)
    .attr("font-size", 25)
    .attr("fill", "#aaa")

    pathlabels.append('textPath')
    .attr('xlink:href',function(d,i) {return '#path'+i})
    .text('+')
    .on('click', (d) => {
      this.removeLoad(d.source.data.load);
      d3.select(d3.event.target.attributes["href"].nodeValue).remove();
    });
  }

  private initNodes(){
    var node = this.g.selectAll(".node")
    .data(this.nodes.descendants())
    .enter().append("g")
    .attr("class", function(d) { 
      return "node" + 
        (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; });

    node.append("rect")
      .attr("width", 50)
      .attr("height", 24)
      .on('click', (d) => {
        this.openLoadDialog(d.data.load);})

    node.append("text")
      .attr("dy", ".35em")
      .attr("x", function(d) { return 25 })
      .attr("y", function(d) { return d.children ? -20 : 40; })
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.load ? d.data.load.$name : "" });
  }

  private removeLoad(load: Load) {
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
  }

  private addLink() {

  }

  private updateDiagram() {
    this.svg.selectAll('.node').remove();
    this.svg.selectAll('.link').remove();
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
    .on("drag", function(d: any) {
      d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")");
    })
    .on("start.render drag.render end.render", () =>
        this.updateLink()
    ));
  }

  private onOverlay() {
    
  }

  private updateLink() {
    this.svg.selectAll('.link').remove();
    this.initLinks();
  }

}

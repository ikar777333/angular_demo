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

  private margin = {top: 40, right: 90, bottom: 50, left: 0};
  private width: number;
  private height: number;
  private svg: any;
  private g: any;
  private treemap: any;
  private nodes: any;
  private loads : Array<Load>;
  private treeData: Array<Node> = [];

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) { 

    store.select(fromRoot.getAllocatedLoads).subscribe(data => {
      this.loads = data}
    );

    this.width = 660 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.treemap = d3.tree().size([this.width, this.height]);
  }

  ngOnInit() {
    this.initSvg();
    this.initData();
    this.initLinks();
    this.initNodes();
    this.initZoom();
  }

  private initData() {
    this.treeData = this.loads.map(function(element){return new Node(element)});
    this.nodes = d3.hierarchy(this.treeData[0])
    this.nodes = this.treemap(this.nodes);
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
    .data(this.nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
       return "M" + d.x + "," + d.y
         + "C" + d.x + "," + (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," + d.parent.y;
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
    node.append("circle")
      .attr("r", 10)
      .on('click', (d) => {
        this.openLoadDialog(d.data.load);
      })
    node.append("text")
      .attr("dy", ".35em")
      .attr("y", function(d) { return d.children ? -20 : 20; })
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.load.$name; });
  }

  private removeLink() {

  }

  private addLink() {

  }

  private updateDiagram() {
    this.svg.selectAll('.node').remove();
    this.svg.selectAll('.link').remove();

    this.initData();
    this.initLinks();
    this.initNodes();
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
    let svg = this.svg;
    this.svg.call(d3.zoom().scaleExtent([0.1, 3]).on("zoom", function () {
      svg.attr("transform", d3.event.transform)
    }))
  }

}

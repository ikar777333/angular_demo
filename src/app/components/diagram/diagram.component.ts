import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store'
import { Load } from "../../models/Load";
import { LoadTypes } from "../../models/LoadTypes.enum"
import { ChangeLoadState } from "../../store/actions/loads"
import * as fromRoot from '../../store/reducers';
import { LoadDialogComponent } from "../LoadDialog/LoadDialog.component"
import { ChooseBusbarDialogComponent } from "../ChooseBusbarDialog/ChooseBusbarDialog.component"

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { STOCKS } from './stocks';

@Component({
  selector: 'app-diagram',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {

  title = 'Line Chart';

  private margin = {top: 40, right: 90, bottom: 50, left: 90};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private treemap: any;
  private line: d3Shape.Line<[number, number]>;

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) { 
    this.width = 660 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.treemap = d3.tree().size([this.width, this.height]);
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
  }

  private initSvg() {
    this.svg = d3.select("body").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
}

private initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(STOCKS, (d) => d.date ));
    this.y.domain(d3Array.extent(STOCKS, (d) => d.value ));
}

private drawAxis() {

    this.svg.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x));

    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y))
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Price ($)');
}

private drawLine() {
    this.line = d3Shape.line()
        .x( (d: any) => this.x(d.date) )
        .y( (d: any) => this.y(d.value) );

    this.svg.append('path')
        .datum(STOCKS)
        .attr('class', 'line')
        .attr('d', this.line);
}

}

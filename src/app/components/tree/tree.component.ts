import {Component, ViewChild, OnInit, ContentChildren, QueryList} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragExit} from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatDialog } from '@angular/material';
import clonedeep from 'lodash.clonedeep';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store'

import { Load } from "../../models/Load";
import * as fromRoot from '../../store/reducers';
import { LoadDialogComponent } from "../LoadDialog/LoadDialog.component"

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass'],
})
export class TreeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'area', 'loadType'];
  notAllocatedDataSource =     new MatTableDataSource();
  allocatedDataSource =        new MatTableDataSource();
  supplyAllocatedDataSource =  new MatTableDataSource();
  notAllocatedDataSourceSubscription:     Subscription;    
  allocatedDataSourceSubscription:        Subscription;
  supplyAllocatedDataSourceSubscription:  Subscription;

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) { 
    this.notAllocatedDataSourceSubscription =     this.store.select(fromRoot.getNotAllocatedLoads).subscribe(data => this.notAllocatedDataSource.data = data);
    this.allocatedDataSourceSubscription =        this.store.select(fromRoot.getAllocatedLoads).subscribe(data => this.allocatedDataSource.data = data);
    this.supplyAllocatedDataSourceSubscription =  this.store.select(fromRoot.getSupplyAllocatedLoads).subscribe(data => this.supplyAllocatedDataSource.data = data);
  }

  openDialog(load: Load): void {
    const dialogRef = this.dialog.open(LoadDialogComponent, {
      width: '30%',
      data: load
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateTables()
    });
  }

  ngOnInit() {}

  updateTables() {
    this.notAllocatedDataSourceSubscription.unsubscribe()
    this.allocatedDataSourceSubscription.unsubscribe()
    this.supplyAllocatedDataSourceSubscription.unsubscribe();
    this.notAllocatedDataSourceSubscription =     this.store.select(fromRoot.getNotAllocatedLoads).subscribe(data => this.notAllocatedDataSource.data = data);
    this.allocatedDataSourceSubscription =        this.store.select(fromRoot.getAllocatedLoads).subscribe(data => this.allocatedDataSource.data = data);
    this.supplyAllocatedDataSourceSubscription =  this.store.select(fromRoot.getSupplyAllocatedLoads).subscribe(data => this.supplyAllocatedDataSource.data = data);
    this.notAllocatedDataSource.data =    clonedeep(this.notAllocatedDataSource.data);
    this.allocatedDataSource.data =       clonedeep(this.allocatedDataSource.data);
    this.supplyAllocatedDataSource.data = clonedeep(this.supplyAllocatedDataSource.data);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex); 
     console.log(event.item.data)                          
    }

    // updates moved data and table, but not dynamic if more dropzones
    this.updateTables()
  }
}
import {Component, ViewChild, OnInit, ContentChildren, QueryList} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatDialog } from '@angular/material';
import clonedeep from 'lodash.clonedeep';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'

import { Load } from "../../models/Load";
import * as fromRoot from '../../store/reducers';
import { AddOne, } from 'src/app/store/actions/loads';
import { LoadDialogComponent } from "../LoadDialog/LoadDialog.component"

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass'],
})
export class TreeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'area', 'loadType'];
  list:   Observable<Array<Load>>;
  list2:  Observable<Array<Load>>;
  list3:  Observable<Array<Load>>;
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) { 
    this.list = store.select(fromRoot.getNotAllocatedLoads);
    this.list2 = store.select(fromRoot.getAllocatedLoads);
    this.list3 = store.select(fromRoot.getSupplyAllocatedLoads);
  }

  openDialog(load: Load): void {
    const dialogRef = this.dialog.open(LoadDialogComponent, {
      width: '30%',
      data: load
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  ngOnInit() {
    this.list.subscribe(data => this.dataSource.data = data);
    this.list2.subscribe(data => this.dataSource2.data = data);
    this.list3.subscribe(data => this.dataSource3.data = data);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    // updates moved data and table, but not dynamic if more dropzones
    this.dataSource.data = clonedeep(this.dataSource.data);
    this.dataSource2.data = clonedeep(this.dataSource2.data);
    this.dataSource3.data = clonedeep(this.dataSource3.data);
  }
}
import {Component, ViewChild, OnInit, ContentChildren, QueryList} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material';
import clonedeep from 'lodash.clonedeep';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'

import { Load } from "../../models/Load";
import * as fromRoot from '../../store/reducers';
import { AddOne, ChangePosition1, ChangePosition2 } from 'src/app/store/actions/loads';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass'],
})
export class TreeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description'];
  list:   Observable<Array<Load>>;
  list2:  Observable<Array<Load>>;
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  constructor(private store: Store<fromRoot.State>) { 
    this.list = store.select(fromRoot.getAllLoads1);
    this.list2 = store.select(fromRoot.getAllLoads2);
  }

  ngOnInit() {
    this.list.subscribe(data => this.dataSource.data = data);
    this.list2.subscribe(data => this.dataSource2.data = data);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
      console.log(this.dataSource.data);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    
    // updates moved data and table, but not dynamic if more dropzones
    this.dataSource.data = clonedeep(this.dataSource.data);
    this.dataSource2.data = clonedeep(this.dataSource2.data);
    this.store.dispatch(new ChangePosition1(this.dataSource.data));
    this.store.dispatch(new ChangePosition2(this.dataSource2.data));
  }
}
import { Component, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Load } from "../../models/Load";
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass']
})
export class TreeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description'];
  selected$: Observable<any>;
  dataSource: any;

  constructor(private store: Store<fromRoot.State>, private changeDetectorRef: ChangeDetectorRef) { 
    this.dataSource = store.select(fromRoot.getAllLoads);
    var a = store.select(fromRoot.getAllLoads);
    a.forEach(function(element){
      console.log(element)
    })
  }

  ngOnChanges() {
    this.populateDataSource(this.dataSource);
  }


  public getTableList(tableNumber: number): Load[] {
    return this.dataSource.filter(x => x.tableNumber === tableNumber);
  }

  public onDrop(table: number, dropResult: CdkDragDrop<Load[]>) {
    console.log('on drop');
    const data = <Load> dropResult.item.data;
    const previousTable = data.tableNumber;
    if (table === data.tableNumber && dropResult.currentIndex === dropResult.previousIndex) {
      return;
    } else {
      data.tableNumber = table;
    }
    this.populateDataSource(this.dataSource);
  }

  // pretend newData is coming from 
  // an http service
  public populateDataSource(data): void {
    const newData = [];
    this.dataSource.forEach(element => {
      const tableItem = Object.assign({}, element);
      newData.push(tableItem);
    });
    this.dataSource =[];
    newData.forEach(item => {
      this.dataSource.push(item);
    });
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    
  }

}

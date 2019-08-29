import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'

import { Load } from "../../models/Load";
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass']
})
export class TreeComponent implements OnInit {

  selected$: Observable<any>;
  dataSource: Observable<any>;
  displayedColumns: string[] = ['id', 'name', 'description'];

  constructor(private store: Store<fromRoot.State>) { 
    this.dataSource = store.select(fromRoot.getAllLoads);
    var a = store.select(fromRoot.getAllLoads);
    a.forEach(function(element){
      console.log(element)
    })
  }

  ngOnInit() {
    
  }

}

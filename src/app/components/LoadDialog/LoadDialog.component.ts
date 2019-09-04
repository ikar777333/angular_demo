import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {LoadAreas} from "../../models/LoadAreas.enum"
import {LoadPurposes} from "../../models/LoadPurposes.enum"
import {LoadSubPurposes} from "../../models/LoadSubPurposes.enum"
import {LoadTypes} from "../../models/LoadTypes.enum"
import {ChangeLoad} from "../../store/actions/loads"
import { Load } from "../../models/Load";
import { Store } from '@ngrx/store'
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'load-dialog-component',
  templateUrl: './LoadDialog.component.html',
  styleUrls: ['./LoadDialog.component.sass']
})
export class LoadDialogComponent implements OnInit {
  form =  {
    name: "",
    area: "",
    purpose: "",
    subPurpose: "",
    loadType: "",
    relatedLoad: 0
  }
  areas =       Object.values(LoadAreas);
  purposes =    Object.values(LoadPurposes);
  subPurposes = Object.values(LoadSubPurposes);
  loadTypes =   Object.values(LoadTypes);
  relatedLoads: Array<string | number>;
  @Output()
  selectionChange: EventEmitter<MatSelectChange>

  constructor(
    private store: Store<fromRoot.State>, 
    private dialogRef: MatDialogRef<LoadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Load) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    this.data.$name = this.form.name;
    //this.data.$area =  this.form.area;
    //this.form.purpose = this.data.$purpose;
    //this.form.subPurpose = this.data.$subPurpose;
    //this.form.loadType = this.data.$loadType;
    this.data.$parentId = this.form.relatedLoad;
    this.store.dispatch(new ChangeLoad(this.data))
  } 

  onChange() {
    this.store.select(fromRoot.getRelatedLoads(this.form.loadType, this.data.$id))
      .subscribe(data => this.relatedLoads = data);
  }

  ngOnInit() {
    this.form.name =        this.data.$name;
    this.form.area =        this.data.$area;
    this.form.purpose =     this.data.$purpose;
    this.form.subPurpose =  this.data.$subPurpose;
    this.form.loadType =    this.data.$loadType;
    this.form.relatedLoad = this.data.$parentId;

    this.store.select(fromRoot.getRelatedLoads(this.form.loadType, this.data.$id))
      .subscribe(data => this.relatedLoads = data);
  }

}

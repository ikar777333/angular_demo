import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import {LoadAreas} from "../../models/LoadAreas.enum"
import {LoadPurposes} from "../../models/LoadPurposes.enum"
import {LoadSubPurposes} from "../../models/LoadSubPurposes.enum"
import {LoadTypes} from "../../models/LoadTypes.enum"
import {ChangeLoadState} from "../../store/actions/loads"
import { Load } from "../../models/Load";
import { Store } from '@ngrx/store'
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'load-dialog-component',
  templateUrl: './LoadDialog.component.html',
  styleUrls: ['./LoadDialog.component.sass']
})
export class LoadDialogComponent implements OnInit {
  form: FormGroup;
  areas =       Object.values(LoadAreas);
  purposes =    Object.values(LoadPurposes);
  subPurposes = Object.values(LoadSubPurposes);
  loadTypes =   Object.values(LoadTypes);
  relatedLoads: Array<fromRoot.RelatedLoad>;
  loadNames:    Array<string>;
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

    if(!this.form.valid)
      return;

    var newLoad = new Load(
      this.data.$id,
      this.form.get("name").value,
      this.form.get("area").value,
      this.form.get("purpose").value,
      this.form.get("subPurpose").value,
      this.form.get("loadType").value,
      this.data.$childrenLoads,
      this.form.get("relatedLoad").value.loadId,
      this.data.$isBusbar
    )

    this.store.dispatch(new ChangeLoadState({oldLoad: this.data, newLoad: newLoad}))
  } 

  onChange() {
    this.store.select(fromRoot.getRelatedLoads(this.form.get("loadType").value, this.data.$id))
      .subscribe(data => this.relatedLoads = data);
  }
  
  nameValidator(loadNames: Array<string>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (loadNames.find(function(element){return control.value === element})) 
        return { 'validUsername': true };
      return null;
    };
  }

  ngOnInit() {
    this.store.select(fromRoot.getRelatedLoads(this.data.$loadType, this.data.$id))
      .subscribe(data => this.relatedLoads = data);

    let loadName = this.data.$name;
    this.store.select(fromRoot.getAllLoads)
      .subscribe(data => {
        this.loadNames = data.map(function(element){return element.$name}).filter(function(element){return element !== loadName});
      });

    let parentId = this.data.$parentId;
    let relatedLoad = this.relatedLoads.find(function(element){
       return element.loadId === parentId;
      });

    this.form = new FormBuilder().group({
      name:         new FormControl(this.data.$name, [
        Validators.required, this.nameValidator(this.loadNames)]),
      area:         new FormControl(this.data.$area, Validators.required),
      purpose:      new FormControl(this.data.$purpose, Validators.required),
      subPurpose:   new FormControl(this.data.$subPurpose, Validators.required),
      loadType:     new FormControl(this.data.$loadType, Validators.required),
      relatedLoad:  new FormControl(relatedLoad, Validators.required),
    });     
  }
}
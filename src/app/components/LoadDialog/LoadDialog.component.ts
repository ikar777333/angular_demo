import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LoadAreas} from "../../models/LoadAreas.enum"
import {LoadPurposes} from "../../models/LoadPurposes.enum"
import {LoadSubPurposes} from "../../models/LoadSubPurposes.enum"
import {LoadTypes} from "../../models/LoadTypes.enum"
import { Load } from "../../models/Load";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'load-dialog-component',
  templateUrl: './LoadDialog.component.html',
  styleUrls: ['./LoadDialog.component.sass']
})
export class LoadDialogComponent implements OnInit {

  areas =       Object.values(LoadAreas);
  purposes =    Object.values(LoadPurposes);
  subPurposes = Object.values(LoadSubPurposes);
  loadTypes =   Object.values(LoadTypes);
  relatedLoads: Observable<Array<Load>>;

  constructor(
    private store: Store<fromRoot.State>, 
    public dialogRef: MatDialogRef<LoadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Load) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

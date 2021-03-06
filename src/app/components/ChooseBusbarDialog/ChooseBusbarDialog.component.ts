import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LoadTypes} from "../../models/LoadTypes.enum"
import * as fromRoot from '../../store/reducers';
import { Load } from "../../models/Load";
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-ChooseBusbarDialog',
  templateUrl: './ChooseBusbarDialog.component.html',
  styleUrls: ['./ChooseBusbarDialog.component.sass']
})
export class ChooseBusbarDialogComponent implements OnInit {
  form =  {
    relatedLoad:  null
  }
  relatedLoads: Array<fromRoot.RelatedLoad>;

  constructor(
    private store: Store<fromRoot.State>,
    private dialogRef: MatDialogRef<ChooseBusbarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Load) {
    }

  ngOnInit() {
    this.store.select(fromRoot.getRelatedLoads(LoadTypes.TYPE2, this.data.$id))
      .subscribe(data => this.relatedLoads = data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    let load = this.data;
    let newLoad = new Load(
      load.$id,
      load.$name,
      load.$area,
      load.$purpose,
      load.$subPurpose,
      LoadTypes.TYPE2,
      load.$childrenLoads,
      this.form.relatedLoad.loadId,
      load.$isBusbar
    )
    this.dialogRef.close({
      oldLoad: this.data,
      newLoad: newLoad
    });
  }
}

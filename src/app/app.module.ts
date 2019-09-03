import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatMenuModule,
  MatCardModule,
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatNativeDateModule,
  MatSelectModule,
  MatInputModule,
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { DiagramComponent } from './diagram/diagram.component';
import { TreeComponent } from './components/tree/tree.component';
import { LoadDialogComponent } from './components/LoadDialog/LoadDialog.component';
import { environment } from '../environments/environment';
import * as fromRoot from './store/reducers/index'; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    DiagramComponent,
    TreeComponent,
    LoadDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatDialogModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    DragDropModule,
    StoreModule.forRoot(fromRoot.reducers),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  entryComponents: [
    LoadDialogComponent
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }

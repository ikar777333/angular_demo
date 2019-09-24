import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagramComponent } from "./components/diagram/diagram.component";
import { TreeComponent } from "./components/tree/tree.component";


const routes: Routes = [
  { path: "diagram", component: DiagramComponent},
  { path: "tree", component: TreeComponent},
  {path: "", 
    redirectTo: '/tree',
    pathMatch: 'full'},
  { path: '**', component: TreeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { DiagramComponent } from "./diagram/diagram.component";
import { TreeComponent } from "./tree/tree.component";


const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "diagram", component: DiagramComponent},
  {path: "tree", component: TreeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

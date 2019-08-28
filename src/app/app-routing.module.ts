import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { DiagramComponent } from "./diagram/diagram.component";
import { TreeComponent } from "./components/tree/tree.component";


const routes: Routes = [
  {path: "", component: HomeComponent,
  children: [
    { path: "", redirectTo: "diagram", pathMatch: "full" },
    { path: "diagram", component: DiagramComponent},
    { path: "tree", component: TreeComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

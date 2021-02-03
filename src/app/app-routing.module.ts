import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'home', loadChildren: './pages/home/home.module#HomeModule'},
  {path: 'entries', loadChildren: './pages/entries/entries.module#EntriesModule'},  
  {path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule'},
  {path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

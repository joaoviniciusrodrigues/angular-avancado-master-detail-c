import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)},
  {path: 'entries', loadChildren: () => import('./pages/entries/entries.module').then(m => m.EntriesModule)},  
  {path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)},
  {path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule)},
  {path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

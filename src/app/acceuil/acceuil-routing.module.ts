import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { acceuilPage } from './acceuil.page';

const routes: Routes = [
  {
    path: '',
    component: acceuilPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class acceuilPageRoutingModule {}

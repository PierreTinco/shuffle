import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { accueilPage } from './accueil.page';

const routes: Routes = [
  {
    path: '',
    component: accueilPage,
  },  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class accueilPageRoutingModule {}

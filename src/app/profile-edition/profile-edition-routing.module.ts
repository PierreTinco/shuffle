import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileEditionPage } from './profile-edition.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileEditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileEditionPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addEventPage } from './add-event/add-event.component';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },


  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}

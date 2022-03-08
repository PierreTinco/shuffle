import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { createEventPage } from './createEvent.page';

const routes: Routes = [
  {
    path: '',
    component: createEventPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class createEventPageRoutingModule {}

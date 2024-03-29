import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createEventPage } from './createEvent.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { createEventPageRoutingModule } from './createEvent-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: createEventPage }]),
    createEventPageRoutingModule,
  ],
  declarations: [createEventPage]
})
export class createEventPageModule {}

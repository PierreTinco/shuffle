import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileEditionPageRoutingModule } from './profile-edition-routing.module';

import { ProfileEditionPage } from './profile-edition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileEditionPageRoutingModule
  ],
  declarations: [ProfileEditionPage]
})
export class ProfileEditionPageModule {}

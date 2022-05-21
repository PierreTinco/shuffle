import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { ProfileEditionComponent } from './profile-edition/profile-edition.component';
import { addEventPage } from './add-event/add-event.component';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
  ],
  declarations: [ProfilePage,ProfileEditionComponent, addEventPage],
  providers: [NativeGeocoder],
})
export class ProfilePageModule {}

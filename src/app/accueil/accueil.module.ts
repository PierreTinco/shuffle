import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { accueilPage } from './accueil.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { accueilPageRoutingModule } from './accueil-routing.module';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    accueilPageRoutingModule,Ng2SearchPipeModule
  ],
  declarations: [accueilPage],
  
})
export class accueilPageModule {}

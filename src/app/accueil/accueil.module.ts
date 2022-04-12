import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { accueilPage } from './accueil.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { accueilPageRoutingModule } from './accueil-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    accueilPageRoutingModule,Ng2SearchPipeModule
  ],
  declarations: [accueilPage]
})
export class accueilPageModule {}

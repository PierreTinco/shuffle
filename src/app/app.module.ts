import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { AngularFireModule } from "@angular/fire";
// import { AngularFireAuthModule } from "@angular/fire/auth";

//Environnement
// export const firebaseConfig = {
//   apiKey: "AIzaSyBsDF7mXn9A8SuiuC5s6PsOGkOyia3bjeM",
//   authDomain: "shuffle-7a186.firebaseapp.com",
//   projectId: "shuffle-7a186",
//   storageBucket: "shuffle-7a186.appspot.com",
//   messagingSenderId: "588062080294",
//   appId: "1:588062080294:web:3320e7f93f57d8756e95e7",
//   measurementId: "G-DHC2E3YW2E"
// };
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

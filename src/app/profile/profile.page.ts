import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import '@firebase/auth'
import { environment } from 'src/environments/environment';
import { getAuth } from "firebase/auth";
import { User } from './profile.model';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  app: any
  user: any
  analytics: any
  auth: any
  buttonValue = 'grid';
  buttonEvents: any[] = [];
  // user = {
  //   gender: null,
  //   name: "",
  //   surname : "",
  //   age :"",
  //   mail: "",
  //   mdp : "",
  //   wallet : "",
  //   phone_number : ""
  // }

  clicked = false
  constructor() { }

  ngOnInit() {
    this.app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth()
    this.user = this.auth.user
    this.buttonEvents = [
      {value: 'grid', icon:'grid'},
      {value: 'reels', icon:'shuffle'}
    ]
  }

  
  buttonsChanged() {

  }

  getUser() {
    if (this.user !== null) {
      this.user.providerData.forEach((profile) => {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    }
  }

  // log0ut() {
  // }

}


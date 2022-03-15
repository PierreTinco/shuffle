import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import '@firebase/auth'
import { environment } from 'src/environments/environment';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  app: any
  analytics: any
  auth: any
  buttonValue = 'grid';
  buttonEvents: any[] = [];
  user = {
    gender: null,
    name: "",
    surname : "",
    age :"",
    mail: "",
    mdp : "",
    wallet : "",
    phone_number : ""
  }
 


  clicked = false
  constructor() { }

  ngOnInit() {
    this.app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth()
    this.buttonEvents = [
      {value: 'grid', icon:'grid'},
      {value: 'reels', icon:'shuffle'}
    ]
  }

  
  buttonsChanged() {

  }



}


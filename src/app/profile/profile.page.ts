import { Component, OnInit } from '@angular/core';
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
    this.auth = getAuth()
    this.user = this.auth.currentUser
    this.buttonEvents = [
      {value: 'grid', icon:'grid'},
      {value: 'reels', icon:'shuffle'}
    ]
  }

  
  buttonsChanged() {

  }

  getUser() {
    if (this.user !== null) {
      console.log(this.user);
      
    }
  }

  // log0ut() {
  // }

}


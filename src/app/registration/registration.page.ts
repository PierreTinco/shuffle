import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import '@firebase/auth'
import { environment } from 'src/environments/environment';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  app: any
  analytics: any
  user = {
    gender: null,
    name: "",
    surname : "",
    birth_date :"",
    email: "",
    password : "",
    wallet : "",
    phone_number : ""
  }
  auth: any
  email:any;
  password: any;
  constructor() { }

  ngOnInit() {this.app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth()
  }
  register(email: any, password: any) {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      
      
      // ..
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import '@firebase/auth'
import { environment } from 'src/environments/environment';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ApiService } from '../services/api.service';
import{ Router } from '@angular/router'
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
    wallet : "",
    phone_number : "",
    token : ""
  }
  auth: any
  email:any;
  password: any;

  constructor(private api: ApiService, private router:Router) {}

  ngOnInit() {
    this.app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth()
  }

  async register(email: any, password: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      this.addUserToDb(user.uid)
      this.router.navigateByUrl('accueil')
      
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

  async addUserToDb(token: any) {
    this.user.token = token
    console.log(this.user);
    
    await this.api.addUser(this.user).subscribe(
      (res) => {
        alert("vos avez bien créé votre compte");
      },
      (err) => {
        alert('Il y a eu une erreur');
      }
    );
  }

}

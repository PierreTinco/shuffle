import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import{ Router } from '@angular/router'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  app: any;
  analytics: any
  auth: any
  email:any;
  password: any;
  constructor(private router:Router) { }

  ngOnInit() {
    this.app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth();
  }

  async signIn(email: any, password: any) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      this.router.navigateByUrl('accueil')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("erreur")
    });
  }


}

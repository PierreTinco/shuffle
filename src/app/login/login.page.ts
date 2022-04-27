import { Component, OnInit } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import{ Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  showPassword = false;
  passwordToggleIcon = "eye-off";
  app: any;
  analytics: any
  auth: any
  email:any;
  password: any;
  user: any
  constructor(private router:Router) { }

  ngOnInit() {
    this.auth = getAuth();
    this.user = this.auth.currentUser
  }

  async signIn(email: any, password: any) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      this.user = userCredential.user;
      this.router.navigateByUrl('accueil')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("erreur")
      console.log(errorCode);
      console.log(errorMessage);
      
    });
  
  }

  togglePassword():void {
    this.showPassword = !this.showPassword;

    if(this.passwordToggleIcon == 'eye'){
      this.passwordToggleIcon = 'eye-off';
    }else {
      this.passwordToggleIcon = 'eye';
    }

  }

  getUser() {

      console.log(this.user);
      

  }

}

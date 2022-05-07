import { Component, OnInit } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import{ Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  showPassword = false;
  passwordToggleIcon = "eye";
  app: any;
  analytics: any
  auth: any
  user: any
  public myForm: FormGroup;
  submitted= false;
  constructor(private router:Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.auth = getAuth();
    this.user = this.auth.currentUser
    this.initForm()
    this.myForm.valueChanges.subscribe(data => console.log('form changes', data));
    this.myForm.valueChanges.subscribe(el => {
     console.log( 'my Form validity',this.myForm.valid); })
  }
  initForm(): void{
    this.myForm =  this.fb.group ({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
       });   
  }

  validForm(){
    console.log( 'my Form validity',this.myForm.valid)
    this.submitted = true;
 
    if (!this.myForm.valid) {
      console.log('All fields are required.')
      alert('Please provide all the required fields.')
      
      return false;
    } else {
      console.log(this.myForm.value) 
      this.signIn(this.myForm.value.email, this.myForm.value.password)
      }
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
      console.log(errorCode);
      console.log(errorMessage);
      alert(errorMessage)

      
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

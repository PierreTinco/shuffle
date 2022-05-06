import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ApiService } from '../services/api.service';
import{ Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm} from "@angular/forms";
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {
  app: any
  analytics: any
  submitted = false;
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
  //repeatPassword:any;
 
  showPassword = false;
  public passwordToggleIcon = "eye-off";
  private myForm: FormGroup;
  public age: number;
  constructor(private api: ApiService, private router:Router,private fb: FormBuilder) {

  }
  
 
  
  ngOnInit() {
    this.auth = getAuth()
    this.initForm()
    this.myForm.valueChanges.subscribe(data => console.log('form changes', data));
    this.myForm.valueChanges.subscribe(el => {
     console.log( 'my Form validity',this.myForm.valid); })
    // this.myForm.controls.valid
    
  }
  
  initForm(): void{
    this.myForm=  this.fb.group ({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?.,:;"@#$%^£&*])(?=.{6,})'), Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?.,:;"@#$%^£&*])(?=.{6,})'), Validators.minLength(6)]],
      //  user: this.fb.group({
        gender: ['', [Validators.required]],
        name: ['',[Validators.required, Validators.minLength(3)]],
        surname : ['',[Validators.required, Validators.minLength(3)]],
        birth_date :['',[Validators.required]],
        phone_number : ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]{10}$')]],
        //  })
       });   
  }


  validForm(){
    this.submitted = true;
 
    // if (!this.myForm.valid) {
    //   console.log('All fields are required.')
    //   alert('Please provide all the required fields.')
      
    //   return false;
    //} else {
      console.log(this.myForm.value) 
      this.register(this.email, this.password)
      
      
   // }
   }
  async register(email: any, password: any) {
    console.log(this.email);
    await createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      this.addUserToDb(user.uid)
      this.router.navigateByUrl('login')
      
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
  // public CalculateAge(): void
  //    {
  //        if(this.myForm.){
  //           var timeDiff = Math.abs(Date.now() - this.birth_date);
  //           //Used Math.floor instead of Math.ceil
  //           //so 26 years and 140 days would be considered as 26, not 27.
  //           this.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  //       }
  //   }
  get errorControl(){
    return this.myForm.controls;
  }
  togglePassword():void {
    this.showPassword = !this.showPassword;

    if(this.passwordToggleIcon == 'eye'){
      this.passwordToggleIcon = 'eye-off';
    }else {
      this.passwordToggleIcon = 'eye';
    }

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

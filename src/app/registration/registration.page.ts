import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
  constructor(private api: ApiService, private router:Router,private fb: FormBuilder) {

  }
  

  // getForm():FormGroup{
  //   return this.myForm;
  // }
  

  ngOnInit() {
    this.initForm()
    // this.myForm.get('email').valueChanges.subscribe(el => {
    //   console.log(    this.myForm.controls['email'].valid
    //   );
    // })
    // //this.myForm.controls['email'].valid
    // console.log(this.myForm.valid)
     this.auth = getAuth()
    
  }


  initForm(): void{
    this.myForm=  this.fb.group ({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword:['', [Validators.required, Validators.minLength(6)]],
      // user: this.fb.group({
        gender: ['', [Validators.required]],
        name: ['',[Validators.required, Validators.minLength(3)]],
        surname : ['',[Validators.required, Validators.minLength(3)]],
        birth_date :['',[Validators.required]],
        wallet : [''],
        phone_number : ['', [Validators.required, Validators.minLength(9), Validators.pattern("^[0-9]{10}$")]],
        token : ['']
        // })
       });
  }

   validForm(f : NgForm){
   
    if (!this.myForm.valid) {
      console.log('All fields are required.')
      return false;
    } else {
      console.log(this.myForm.value)
    }
   }
  async register(email: any, password: any) {
    this.submitted = true;
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

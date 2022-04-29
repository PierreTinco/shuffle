import { Component, OnInit } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ApiService } from '../services/api.service';
import{ Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from "@angular/forms";
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
  //repeatPassword:any;
 
  showPassword = false;
  passwordToggleIcon = "eye-off";

  private formBuilder: FormBuilder;
  private myForm: FormGroup;

  constructor(private api: ApiService, private router:Router,formBuilder: FormBuilder) {
    this.formBuilder =formBuilder;
    this.myForm= this.createForm();
  }
  private createForm():FormGroup{
   return this.myForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeatPassword:['', [Validators.required, Validators.minLength(6)]],
      user: this.formBuilder.group({
        gender: ['', [Validators.required]],
        name: ['',[Validators.required, Validators.minLength(3)]],
        surname : ['',[Validators.required, Validators.minLength(3)]],
        birth_date :['',[Validators.required]],
        wallet : [''],
        phone_number : ['', [Validators.required, Validators.minLength(9)]],
        token : ['']
      })
    });
   
  }

  getForm():FormGroup{
    return this.myForm;
  }
  

  ngOnInit() {
    this.auth = getAuth()
    
  }


  async register(email: any, password: any) {
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

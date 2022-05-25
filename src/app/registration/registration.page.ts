import { Component, OnInit } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {

  app: any
  analytics: any
  submitted = false;
  auth: any
  public passwordToggleIcon = "eye";
  public myForm: FormGroup;
  public age: number;
  showPassword = false;
  constructor(private api: ApiService, private router: Router, private fb: FormBuilder) {

  }



  ngOnInit() {
    this.auth = getAuth()
    this.initForm()
    this.myForm.valueChanges.subscribe(data => console.log('form changes', data));
    this.myForm.valueChanges.subscribe(el => {
      console.log('my Form validity', this.myForm.valid);
    })
  }

  initForm(): void {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      user: this.fb.group({
        gender: ['', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(3)]],
        surname: ['', [Validators.required, Validators.minLength(3)]],
        birth_date: ['', [Validators.required]],
        phone_number: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]{10}$')]],
      })
    });
  }


  validForm() {
    console.log('my Form validity', this.myForm.valid)
    this.submitted = true;

    if (!this.myForm.valid) {
      console.log('All fields are required.')
      alert('Please provide all the required fields.')

      return false;
    } else {
      console.log(this.myForm.value)
      this.register(this.myForm.value.email, this.myForm.value.password)
    }
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
        alert(errorMessage);


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
  get errorControl() {
    return this.myForm.controls;
  }
  togglePassword(): void {
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }

  }
  async addUserToDb(token: any) {
    this.myForm.value.user.token = token


    await this.api.addUser(this.myForm.value.user).subscribe(
      (res) => {
        alert("Vous avez bien créé votre compte");
      },
      (err) => {
        alert('Il y a eu une erreur');
      }
    );
  }

}

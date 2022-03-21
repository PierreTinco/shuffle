import { Component, OnInit } from '@angular/core';
import{ Router } from '@angular/router'
import { getAuth } from "firebase/auth";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {
  logo: any
  auth: any;
  user: any;
  constructor(private routes:Router) { }

  ngOnInit() {
    this.auth = getAuth()
    this.user = this.auth.currentUser
    console.log(this.user);
    
    this.logo = '..\..\logo.png'
    setTimeout(() => {
      if(this.user == null)
        this.routes.navigateByUrl('welcome');
      else
        this.routes.navigateByUrl('accueil');
    }, 3000);
  }

}



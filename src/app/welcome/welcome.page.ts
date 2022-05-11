import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import{ Router } from '@angular/router'
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  auth: any
  user: any
  constructor(private routes:Router) { }

  ngOnInit() {
    this.auth = getAuth()
    this.user = this.auth.currentUser
    console.log(this.user);
    if(this.user != null)
      this.routes.navigateByUrl('accueil');
 }

}

import { Component, OnInit } from '@angular/core';
import{ Router } from '@angular/router'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from '../environments/environment';
import { getAuth } from "firebase/auth";



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  firabaseApp: any
  analytics: any
  auth: any;
  user: any;
  constructor(private router:Router) {
    this.initializeApp();
  }
  async ngOnInit() {
    this.auth = getAuth();
    this.user = this.auth.currentUser
    console.log("user: ", this.user );
    
  
    this.router.navigateByUrl('loading') 
  }

  initializeApp(){
    this.firabaseApp = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.firabaseApp); 
  }

  
}

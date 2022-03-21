import { Component, OnInit } from '@angular/core';
import{ Router } from '@angular/router'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from 'src/environments/environment';
import { getAuth } from "firebase/auth";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  app: any
  analytics: any
  auth: any;
  user: any;
  constructor(private router:Router) {
  }
  async ngOnInit() {
    this.initializeApp();  
  }

  initializeApp(){
    this.app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.app); 
    this.auth = getAuth(this.app);
    console.log(this.auth);
    
  
    this.router.navigateByUrl('loading')
  }
  
}

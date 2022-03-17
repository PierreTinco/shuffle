import { Component, OnInit } from '@angular/core';
import{ Router } from '@angular/router'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  app: any
  analytics: any
  constructor(private router:Router) {
    this.initializeApp();  
  }
  async ngOnInit() {
   
  }
  initializeApp(){
    this.app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.router.navigateByUrl('loading')
  }
  
}

import { Component, OnInit } from '@angular/core';
import{ Router } from '@angular/router'
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(private router:Router) {
    this.initializeApp();  
  }
  async ngOnInit() {
   
  }
  initializeApp(){
    this.router.navigateByUrl('loading')
  }
  



}

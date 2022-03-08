import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  buttonValue = 'grid';
  buttonEvents: any[] = [];
  user = {
    gender: null,
    name: "",
    surname : "",
    age :"",
    mail: "",
    mdp : "",
    wallet : "",
    phone_number : ""
  }
  constructor() { }

  ngOnInit() {
    this.buttonEvents = [
      {value: 'grid', icon:'grid'},
      {value: 'reels', icon:'shuffle'}
    ]
  }

  editProfil(){
    
  }

}


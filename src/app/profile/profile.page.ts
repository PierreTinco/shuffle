import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
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
  }

}

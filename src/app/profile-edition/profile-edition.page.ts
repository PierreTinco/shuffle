import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-profile-edition',
  templateUrl: './profile-edition.page.html',
  styleUrls: ['./profile-edition.page.scss'],
})
export class ProfileEditionPage implements OnInit {
    user = {
    token: "",
    gender: null,
    name: "",
    surname : "",
    pseudo : "",
    birth_date :"",
    email: "",
    password : "",
    wallet: "",
    phone_number : ""
  }

  photo = 'https://i.pravatar.cc/150';

  constructor() { }

  ngOnInit() {
  }
  openOptionSelection()
  {}

  editProfil()
  {}

  startCapture() {
  
  }
}

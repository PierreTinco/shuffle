import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  user = {
    name : "",
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

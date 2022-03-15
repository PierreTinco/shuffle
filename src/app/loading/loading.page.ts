import { Component, OnInit } from '@angular/core';
import{ Router } from '@angular/router'
import { url } from 'inspector';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {
  logo: any
  constructor(private routes:Router) { }

  ngOnInit() {
    this.logo = '..\..\logo.png'
    setTimeout(() => {
      this.routes.navigateByUrl('welcome');
    }, 3000);
  }

}

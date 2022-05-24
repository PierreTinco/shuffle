import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { DataStorageService } from 'src/app/services/datastorage.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  details: any;
  currentModal: any;
  constructor(params: NavParams,private router:Router,private data : DataStorageService) { }

  ngOnInit() {
    console.log("Current event modal",this.data.get_event());
    this.details =this.data.get_event();

  }

  dismissModal() {
    this.currentModal= this.data.get_modal();
    if (this.currentModal) {
      this.currentModal.dismiss().then(() => {
        this.currentModal = null;
      });
    }
  }

}

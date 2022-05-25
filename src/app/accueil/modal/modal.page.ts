import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { getDownloadURL, ref } from 'firebase/storage';
import { DataStorageService } from 'src/app/services/datastorage.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  details: any;
  currentModal: any;
  photoLoaded: boolean;
  constructor(params: NavParams,private router:Router,private data : DataStorageService, private pic: PhotoService) { }

  ngOnInit() {
    
    this.details =this.data.get_event();
    console.log("Current event modal",this.details);
    this.getPhotoUrl()
  }

  public async getPhotoUrl() {
      if(this.details.firebaseId != null)
      {
        getDownloadURL(ref(this.pic.storage, `photos/events/${this.details.firebaseId}`))
        .then((url) => {
          // `url` is the download URL for the user photo
          // this.photoUrl = url
          console.log("url image",  url);
          this.details.url = url
          this.photoLoaded = true
          
        })
        .catch((error) => {
          // Handle any errors
          console.log('erreur image');

        });
    }
  

    
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

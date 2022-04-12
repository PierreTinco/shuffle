import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { ActionSheetController } from '@ionic/angular';
import { ApiService, UserPhoto } from '../services/api.service';
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
  filepath: string;
  webviewPath: string;
  


  photo = 'https://i.pravatar.cc/150';
  public photos: UserPhoto[] = [];
  constructor(private api: ApiService,
    public actionSheetController: ActionSheetController) { }

  async ngOnInit() {
    await this.api.loadSaved();
  }
  openOptionSelection(){}

  editProfil(){}
    
  addPhotoToGallery() {
      this.api.choosePicture();
    }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change profile photo',
      buttons: [{
        text: 'New profile photo',
        role: 'changement',
        icon: 'camera',
        handler: () => {
        this.api.choosePicture();
        console.log('Confirm Changement');
        }
      },{
        text: 'Remove profile photo',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.api.deletePicture(photo, position);
          console.log('Confirm Destruction');
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
       
        handler: () => {
          // Nothing to do, action sheet is automatically closed
          console.log('Confirm Cancel');
          }
      }]
    });
    await actionSheet.present();
  }

 
  
}

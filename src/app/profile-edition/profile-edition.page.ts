import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { ActionSheetController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { ApiService, UserPhoto } from '../services/api.service';
@Component({
  selector: 'app-profile-edition',
  templateUrl: './profile-edition.page.html',
  styleUrls: ['./profile-edition.page.scss'],
})
export class ProfileEditionPage implements OnInit {
  currentUser: any
  users: any
  auth: any
  user: any
  firebaseUser: any
  filepath: string;
  webviewPath: string;
  


  photo = 'https://i.pravatar.cc/150';
  public photos: UserPhoto[] = [];
  connected: boolean;
  constructor(private api: ApiService,
    public actionSheetController: ActionSheetController) { }

  async ngOnInit() {
    this.auth = getAuth()
    this.firebaseUser = this.auth.currentUser
    this.users = await this.api.getUser().toPromise()
    console.log(this.users);
     this.filterUser()
    this.user = this.currentUser[0]
    console.log("current user test", this.user);
    await this.api.loadSaved();
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
  async filterUser() {
    const userToken = this.firebaseUser.uid  
    this.currentUser = this.users.filter(users =>
      users.token == userToken
    );
    console.log("current user ", this.currentUser);
  }
 
  editProfil(){

  }
}

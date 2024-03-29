import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ApiService, UserPhoto } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile-edition',
  templateUrl: './profile-edition.component.html',
  styleUrls: ['./profile-edition.component.scss'],
})
export class ProfileEditionComponent implements OnInit {

  currentUser: any
  users: any
  auth: any
  @Input() user: any
  firebaseUser: any
  filepath: string;
  webviewPath: string;
  


  photo = 'https://i.pravatar.cc/150';
  public photos: UserPhoto[] = [];
  connected: boolean;
  constructor(private api: ApiService,
    public actionSheetController: ActionSheetController) { }

  async ngOnInit() {
    console.log("current user test", this.user);
    await this.api.loadSaved();
  }

  public async showActionSheet() {
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
          // this.api.deletePicture(photo, position);
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

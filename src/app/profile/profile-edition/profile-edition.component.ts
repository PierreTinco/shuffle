import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { getDownloadURL, ref } from 'firebase/storage';
import { ApiService } from 'src/app/services/api.service';
import { DataStorageService } from 'src/app/services/datastorage.service';
import { PhotoService, UserPhoto } from 'src/app/services/photo.service';

@Component({
  selector: 'app-profile-edition',
  templateUrl: './profile-edition.component.html',
  styleUrls: ['./profile-edition.component.scss'],
})
export class ProfileEditionComponent implements OnInit {
  photoUrl : any
  currentUser: any
  users: any
  auth: any
  user: any
  firebaseUser: any
  filepath: string;
  webviewPath: string;

  update: any
  where: any
  photo:any;
  position:any;

  //photo = 'https://i.pravatar.cc/150';
  public photos: UserPhoto[] = [];
  connected: boolean;
  photoLoaded: boolean;
  constructor(public pic: PhotoService,private api: ApiService,
    public actionSheetController: ActionSheetController, private dataStorageService : DataStorageService) { }


  async ngOnInit() {
    this.user = this.dataStorageService.get_user()
    console.log("current user test", this.user);
    await this.getPhotoUrl()
  }

  public async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change profile photo',
      buttons: [{
        text: 'New profile photo',
        role: 'changement',
        icon: 'camera',
        handler: () => {
        this.pic.chooseProfilePicture();
        console.log('Confirm Changement');
        }
      },{
        text: 'Remove profile photo',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.pic.deletePicture(this.photo, this.position);
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
 
  async editProfil(){
    await this.api.updateUser({update : this.user[0], where :{id: this.user[0].id}}).subscribe(
      (res) => {
        alert("Profile updated")
      },
      (err) => {
        alert("error update profile")
      }
    )
  }

  public async getPhotoUrl(){
    this.currentUser = this.dataStorageService.get_user()
    getDownloadURL(ref(this.pic.storage, `photos/users/${this.currentUser.id}`))
    .then((url) => {
      // `url` is the download URL for the user photo
      this.photoUrl = url
      console.log("url image", this.photoUrl); 
      this.photoLoaded = true
    })
    .catch((error) => {
      // Handle any errors
      console.log('erreur image');

    });
  } 

}


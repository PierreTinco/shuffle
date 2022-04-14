import { Component, OnInit } from '@angular/core';
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

declare let window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  app: any
  currentUser: any
  user: any
  users: any 
  auth: any
  buttonValue = 'grid';
  connected = false
  buttonEvents: any[] = [];
  clicked = false
  curentAccount: any;

  constructor(private api: ApiService,public alertController: AlertController,
    public actionSheetController: ActionSheetController) { }

  async ngOnInit() {
    this.auth = getAuth()
    this.user = this.auth.currentUser
    this.users = await this.api.getUser().toPromise()
    console.log(this.users);
    this.filterUser()
    console.log("current user ", this.currentUser[0].name);
    if (this.user != null )
    {
      this.connected = true
    }
    this.buttonEvents = [
      {value: 'grid', icon:'grid'},
      {value: 'reels', icon:'shuffle'}
    ]
  }

  
  buttonsChanged() {

  }

  async openAlertLogOut(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure you want to log out?',
      subHeader: 'Subtitle',
      message: 'You saved your credentials, so the logging back in will be easy.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        console.log('Confirm Cancel');
        }
      },{
        text: 'Log Out',
        role: 'log out',
        handler: () => {
          this.logOut();
          console.log('Confirm Destruction');
        }
      }]
    });
    await alert.present();
  }
  async openAlerConnectWallet(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure you want to connect your wallet?',
      subHeader: 'Subtitle',
      message: 'You will be laeding to the loading page of your Metamask.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        console.log('Confirm Cancel');
        }
      },{
        text: 'Connect',
        role: 'connect',
        handler: () => {
          this.connectWallet();;
          console.log('Confirm Destruction');
        }
      }]
    });
    await alert.present();
  }
  
  connectWallet() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts', params: [] })
        .then((res) => (this.curentAccount = res))
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
            this.connected = false;
            return;
          } else {
            console.error(err);
            this.connected = false;
            return;
          }
        });
      this.connected = true;
    }
  }

  logOut() {

    signOut(this.auth).then(() => {
      // Sign-out successful.
      this.connected = false
      alert('deconnexion')
    }).catch((error) => {
      // An error happened.
      alert('erreur')
    });
  }

  filterUser() {
    const userToken = this.user.uid  
    this.currentUser = this.users.filter(users =>
      users.token == userToken
    );
    console.log("current user ", this.currentUser);
  }
  public async showMenuSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '___',
      buttons: [{
        text: 'Log out',
        role: 'log out',
        handler: () => {
        this.openAlertLogOut();
        console.log('Confirm Changement');
        }
      },{
        text: 'Settings',
        role: '',
        icon: 'cog',
        handler: () => {
          console.log('Confirm Setting mode');
        }
      }, {
        text: 'Connect wallet',
        role: 'connect',
        icon: 'wallet',
        handler: () => {
        this.openAlerConnectWallet();
        console.log('Confirm wallet');
        }
      }]
    });
    await actionSheet.present();
  }


}


import { Component, OnInit } from '@angular/core';
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { ApiService } from '../services/api.service';
import { AlertController, mdTransitionAnimation, PopoverController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import{ Router, RouterLink } from '@angular/router'
import { PopoverComponent} from '../popover/popover.component';
import { DataStorageService } from '../services/datastorage.service';
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
 segmentModel ="creator";
 friends:any
 viewFriends=null;
 photo = 'https://i.pravatar.cc/150';
 sliderConfig={
   spaceBetween:5,
   centeredSlides:true,
   slidesPerView:2
 }
 eventsUser : any = []
viewAll = true
isEditing = false
  constructor(private api: ApiService,public alertController: AlertController,private dataStorageService : DataStorageService,
    public actionSheetController: ActionSheetController, private popCtrl: PopoverController,private routes:Router) { }

  async ngOnInit() {
    this.auth = getAuth()
    this.user = this.auth.currentUser
    console.log("this.user",this.user)
    this.currentUser = await this.api.getUser({where : {token : this.user.uid} }).toPromise()
    this.eventsUser = await this.api.getUserEvent({where : {id_user : this.currentUser[0].id },join : {type : "INNER JOIN", tableJoin : "event", keyFrom : "id_event",keyJoin : "id"}}).toPromise()
    // console.log("this.eventsUser",this.eventsUser)
    console.log("current user profile : ", this.currentUser);
    
    this.users = await this.api.getUser({}).toPromise()
    this.viewAll =true
    if (this.user != null )
    {
      this.connected = true
    }
  }


  returnGoodrray(arr : any){
    let temp = []
    temp = arr.filter((el : any)=>el.statut == this.segmentModel)
    return temp
  }
  goEditMode(){
    this.isEditing = !this.isEditing
  }
  buttonsChanged(event:any) {
    this.segmentModel=event.target.value;
    console.log(this.segmentModel);  
    console.log('event:' ,event);
  }

  async openAlertLogOut(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'log out?',
      subHeader: 'Are you sure you want to log out ?',
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


  public async openPopover(ev:any){
     const popover=await this.popCtrl.create({
       component: PopoverComponent,
       componentProps: {

       },
       event: ev,
       translucent:true,
       mode:'md'

     })
     return await popover.present()

  }
  public async showMenuSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '___',
      buttons: [{
        text: this.connected?'Log out':'Login',
        role:this.connected?'log out': 'login' ,
        handler: () => {
          this.connected? this.openAlertLogOut(): this.goToLogin();
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
        
        },
      },{
        text: 'Create an event',
        role: 'create',
        icon: 'add',
        handler: () => {
          this.goTocreateEvent();
          },
          
      }]
    });
    await actionSheet.present();
  }


  goToFollowPage(path : string){
    this.dataStorageService.setfollowerClickString(path)
    this.routes.navigate(['/follow'])
  }
  goTocreateEvent() {
    this.dataStorageService.setid_user_creator(this.currentUser[0].id)
    this.routes.navigate(['/addevent']);
    //['/addEvent', {id:this.currentUser[0].id}]
  }
  goToLogin() {
    this.routes.navigate(['/welcome']);

  }

  viewFriendF() {
    this.viewFriends = !this.viewFriends;
  }


}


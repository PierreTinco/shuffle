import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import Web3 from 'web3';
import { Event } from './accueil.model';
import { getAuth } from "firebase/auth";
//import { Geolocation } from '@capacitor/geolocation';
//import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { Observable } from 'rxjs';
//import { LatLng } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/common/latlng.interface';

declare let window: any;

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.page.html',
  styleUrls: ['accueil.page.scss'],
})
export class accueilPage implements OnInit {
  back = false
  currentUser: any
  details: Event;
  events: any;
  user: any;
  auth: any;
  provider: any;
  clicked = false;
  connected = false;
  curentAccount: any;
  searchText = '';
  date: string;
  ticket_qty = null;
  viewMap = null;
  totalVal = null;
  //maxTicket=this.details[0].max_participant;

  // map: google.maps.Map;

  web3 = new Web3(
    'https://ropsten.infura.io/v3/2d0c4c5065844f828e66b7b2f543a119'
  );
  balance1: any;
  free = false;
  @ViewChild('map') mapView: ElementRef;
  constructor(private api: ApiService) {}
 
  // ionViewDidEnter() {
  //   console.log('on ViewDidEnter');
  //   this.initMap();
  // }

  async ngOnInit() {
    this.auth = getAuth();
    this.user = this.auth.currentUser;

    const chainObservable: any = null
    console.log('on init accueil');
    this.events = await this.api.getAllEvents({}).toPromise();
    this.currentUser = await this.api.getUser({where : {token : this.user.uid} }).toPromise()
    console.log(this.currentUser);
    if(window.ethereum)
    {
      console.log(window.ethereum.chainId);

      if (window.ethereum.selectedAdress == window.ethereum) {
        console.log('test');
  
        this.connected = true;
      }
      
      window.ethereum.on('chainChanged', (chainId) => {

        console.log(chainId);
  
        
      
      });
    }

    

  }

  async participateFree(currentEvent: any) {
    
    for(let i = 0 ; i < this.ticket_qty; i++)
    {
    await this.api.addUserEvent({id_user: this.currentUser[0].id,id_event: currentEvent.id, statut: "participant"}).subscribe(
      (res) => {
        alert('ok userEvent')
      }
      )
    
    }
  }

  participate(walletAdress: any) {
    this.sendTr(walletAdress);
  }

  add() {
    if (this.details[0].max_participant != 0){
     this.details[0].max_participant-=1;
     console.log('restTicket: '+ this.details[0].max_participant);
     this.ticket_qty += 1;
     console.log('Ticket qty: '+this.ticket_qty);
    }
    else{
      this.details[0].max_participant=0;
      console.log('restTicket: '+ this.details[0].max_participant);
      console.log('Ticket qty: '+this.ticket_qty);
    }
   
    this.total();
  }

  remove() {
    if (this.ticket_qty - 1 < 1) {
      this.ticket_qty = 1;
      console.log('ticket_1->' + this.ticket_qty);
      console.log( 'restTicket: '+this.details[0].max_participant);
      this.total();
    } else {
      this.ticket_qty -= 1;
      console.log('ticket_2->' + this.ticket_qty);
      this.details[0].max_participant+=1;
      console.log( 'restTicket: '+ this.details[0].max_participant);
      this.total();
    }
  }

  total(){
    
    this.totalVal = (this.details[0].price * this.ticket_qty);
    console.log('Ticket total price: '+ this.totalVal);
    
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

  return() {
    this.clicked = false;
  }

  sendTr(hostAccount: any) {
    console.log(this.curentAccount);
    console.log(hostAccount);

    if (window.ethereum) {
      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: this.curentAccount[0],
              to: hostAccount,
              value: this.totalVal,
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((_error: any) => console.error);
    }
  }

  viewMore(id: any) {
    console.log(id, 'id de levent que lon veut ouvrir');
    this.clicked = !this.clicked;
    this.details = this.events.filter((event) => event.id == id);
    console.log(this.details, 'this.details');
    if (this.details[0].free == 1) this.free = true;
    else this.free = false;
  }

  filterEvent(str: any) {
    console.log(str.target.value);
    this.events = this.events.filter((event) =>
      event.nom.includes(str.target.value)
    );
  }

  // async printCurrentPosition() {
  //   const coordinates = await Geolocation.getCurrentPosition();

  //   console.log('Current position:', coordinates);
  // }

  checkChainId() {
    // Create an Observable that will start listening to chain updates
    // when a consumer subscribes.
    const chainId = new Observable((observer) => {
      let watchId: number;
      if(window.ethereum.isConnected())
      {
        window.ethereum.on('chainChanged', (chainId) => {
          // Handle the new chain.
          // Correctly handling chain changes can be complicated.
          // We recommend reloading the page unless you have good reason not to.
          console.log(chainId);
          
        
        });
      }
      return observer
    });
  }
  
  viewMapfct() {
    this.viewMap = !this.viewMap;
  }

  // initMap() {
    // const directionsRenderer = new google.maps.DirectionsRenderer();
    // const directionsService = new google.maps.DirectionsService();
    // const center = { lat: 30, lng: -110 };

    // this.map = new google.maps.Map(
    //   document.getElementById('map') as HTMLElement,
    //   {
    //     center: center,
    //     zoom: 8,
    //   }
    // );
    // const marker = new google.maps.Marker({
    //   position: center,
    //   map: this.map,
    // });
    
    // const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    // console.log("initMap ~ boundingRect",boundingRect)
    // CapacitorGoogleMaps.create({
    //   width: Math.round(boundingRect.width),
    //   height: Math.round(boundingRect.height),
    //   x: Math.round(boundingRect.x),
    //   y: Math.round(boundingRect.y),
    //   // latitude?:number;
      
    //   zoom: 5
    // });
    // addListener(eventName: 'didTap', listenerFunc: (results: any) => void): PluginListenerHandle;
    // addListener(eventName: 'dragEnded', listenerFunc: (results: any) => void): PluginListenerHandle;
    // addListener(eventName: 'didTapAt', listenerFunc: (results: any) => void): PluginListenerHandle;
    // addListener(eventName: 'didTapPOIWithPlaceID', listenerFunc: (results: any) => void): PluginListenerHandle;
    // addListener(eventName: 'didChange', listenerFunc: (results: any) => void): PluginListenerHandle;
  //   CapacitorGoogleMaps.addListener('onMapReady', async () => {
  //     CapacitorGoogleMaps.setMapType({
  //       type: "normal" // hybrid, satellite, terrain
  //     });
    
  //   CapacitorGoogleMaps.addListener('didTapPOIWithPlaceID', async (ev) => {
  //     const result = ev.results;
  //     const alert = await this.alertCtrl.create({
  //       header: result.name,
  //       message: `Place ID:  ${result.placeID}`,
  //       buttons: ['OK']
  //     });
  //      await alert.present();
  //     });  
  //     this.showCurrentPosition();
  //   });
  // }
 
  // async showCurrentPosition() {
  //   Geolocation.requestPermissions().then(async premission => {
  //     const coordinates = await Geolocation.getCurrentPosition();
    
  //     // Create our current location marker
  //     CapacitorGoogleMaps.addMarker({
  //       latitude: coordinates.coords.latitude,
  //       longitude: coordinates.coords.longitude,
  //       title: 'My Current Position',
  //       snippet: 'Come and find me!'
  //     });
    
  //     // Focus the camera
  //     CapacitorGoogleMaps.setCamera({
  //       latitude: coordinates.coords.latitude,
  //       longitude: coordinates.coords.longitude,
  //       zoom: 12,
  //       bearing: 0
  //     });
  //   });
  // }

  // draw() {
  //   const points: LatLng[] = [
  //     {
  //       latitude: 51.88,
  //       longitude: 7.60,
  //     },
  //     {
  //       latitude: 55,
  //       longitude: 10,
  //     }
  //   ];
 
  //   CapacitorGoogleMaps.addPolyline({
  //     points,
  //     color: '#ff00ff',
  //     width: 2
  //   });
  // }
  // ionViewDidLeave() {
  //   CapacitorGoogleMaps.close();
  // }

}

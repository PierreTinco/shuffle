import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import Web3 from 'web3';
import { Event } from './accueil.model';
import { getAuth } from "firebase/auth";
import { format, parseISO } from 'date-fns';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMapsModule } from '@angular/google-maps';
import { Observable } from 'rxjs';

declare let window: any;

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.page.html',
  styleUrls: ['accueil.page.scss'],
})
export class accueilPage implements OnInit {
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

  map: google.maps.Map;

  web3 = new Web3(
    'https://ropsten.infura.io/v3/2d0c4c5065844f828e66b7b2f543a119'
  );
  balance1: any;
  free = false;
  constructor(private api: ApiService) {}
  // @ViewChild('map') mapView: ElementRef;

  async ngOnInit() {

      console.log(window.ethereum.chainId);
    const chainObservable: any = null
    console.log('on init accueil');
    this.events = await this.api.getAllEvents().toPromise();
    console.log(this.events);
    this.auth = getAuth();
    this.user = this.auth.currentUser;
    //chainObservable.subscribe(this.checkChainId())
    //console.log(chainObservable);
    window.ethereum.on('chainChanged', (chainId) => {

      console.log(chainId);

      
    
    });
    
    if (window.ethereum.selectedAdress == window.ethereum) {
      console.log('test');

      this.connected = true;
    }
  }

  participateFree() {}

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
    else {
      this.details[0].max_participant=0;
      console.log('restTicket: '+ this.details[0].max_participant);
      console.log('Ticket qty: '+this.ticket_qty);
    }
   
    this.total();
  }
//pas bien fait 
  remove() {
    if (this.ticket_qty - 1 < 1) {
      this.ticket_qty = 1;
      console.log('ticket_1->' + this.ticket_qty);
      this.details[0].max_participant+=1;
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

  viewMapfct() {
    this.viewMap = !this.viewMap;
  }

  filterEvent(str: any) {
    console.log(str.target.value);
    this.events = this.events.filter((event) =>
      event.nom.includes(str.target.value)
    );
  }

  async printCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
  }

  initMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const center = { lat: 30, lng: -110 };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: center,
        zoom: 8,
      }
    );
    const marker = new google.maps.Marker({
      position: center,
      map: this.map,
    });
  }

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

}

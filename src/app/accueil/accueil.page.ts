import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../services/api.service';
import Web3 from 'web3';
import { Event } from './accueil.model';
import { getAuth } from "firebase/auth";
import { format, parseISO } from 'date-fns';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from './modal/modal.page';
import { PhotoService } from '../services/photo.service';
import { getDownloadURL, ref } from 'firebase/storage';
import { DataStorageService } from '../services/datastorage.service';
import { Capacitor } from '@capacitor/core';

declare let window: any;

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.page.html',
  styleUrls: ['accueil.page.scss'],
})
export class accueilPage implements OnInit {
  photosUrl = [];
  infoWindos: any = [];
  public lat: any;
  public lng: any;
  photoUrl: any;
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
  ticket_qty = 1;
  viewMap = null;
  filter = null;
  totalVal = null;
  wait: any;

  //maxTicket=this.details[0].max_participant;

  @ViewChild('map') mapView: ElementRef<HTMLElement>;
  map: GoogleMap;
  // title: string;
  markerId: any;
  coords: any;
  web3 = new Web3(
    'https://ropsten.infura.io/v3/2d0c4c5065844f828e66b7b2f543a119'
  );
  balance1: any;
  free = false;
  markerEventId: string[];
  categoriesSelected: any;
  eventsCategories: Observable<Object>;
  copyEvent : any = []
  photoLoaded: boolean = false;
  // markerEventId: string;


  constructor(private api: ApiService, public alertController: AlertController, public ngZone: NgZone, private photos: PhotoService, private modalCtrl: ModalController,private data: DataStorageService) { }


  async ngOnInit() {
    this.auth = getAuth();
    this.user = this.auth.currentUser;
    const chainObservable: any = null
    console.log('on init accueil');
    this.events = await this.api.getAllEvents({}).toPromise();
    this.copyEvent = this.events.slice()
    this.currentUser = await this.api.getUser({ where: { token: this.user.uid } }).toPromise()
    console.log(this.currentUser);
    if (window.ethereum) {
      console.log(window.ethereum.chainId);

      if (window.ethereum.selectedAdress == window.ethereum) {
        this.connected = true;
      }

      window.ethereum.on('chainChanged', (chainId) => {
        console.log(chainId);
      });
    }
    // for(let i = 0 ; i < this.events.length ; i++)
    // {
    //   console.log("test for");
    //   await this.getPhotoUrl(this.events[i]).then((url)=>{
    //     // console.log("url",url)
    //     // this.photosUrl.push(url)
    //     console.log("this.photoUrl",this.photoUrl)
    //     this.events[i].url = this.photoUrl
    //     console.log("this.events",this.events)
    //     // console.log("this.photoUrl",this.photoUrl)
    //   })
      
    // }
    console.log("photosUrl", this.photosUrl);
   await this.getPhotoUrl()

  }
  ngAfterViewInit() {
    console.log('on ngAfterViewInit')
    this.createMap()
    this.track()
    this.stopTracking()
  }

  async participateFree(currentEvent: any) {

    for (let i = 0; i < this.ticket_qty; i++) {
      await this.api.addUserEvent({ id_user: this.currentUser[0].id, id_event: currentEvent.id, statut: "participant" }).subscribe(
        (res) => {
          
        }
      )

    }
  }



  add() {
    if (this.details[0].max_participant != 0) {
      this.details[0].max_participant -= 1;
      console.log('restTicket: ' + this.details[0].max_participant);
      this.ticket_qty += 1;
      console.log('Ticket qty: ' + this.ticket_qty);
    }
    else {
      this.details[0].max_participant = 0;
      console.log('restTicket: ' + this.details[0].max_participant);
      console.log('Ticket qty: ' + this.ticket_qty);
    }

    this.total();
  }

  remove() {
    if (this.ticket_qty - 1 < 1) {
      this.ticket_qty = 1;
      console.log('ticket_1->' + this.ticket_qty);
      console.log('restTicket: ' + this.details[0].max_participant);
      this.total();
    } else {
      this.ticket_qty -= 1;
      console.log('ticket_2->' + this.ticket_qty);
      this.details[0].max_participant += 1;
      console.log('restTicket: ' + this.details[0].max_participant);
      this.total();
    }
  }

  total() {
    this.totalVal = (this.details[0].price * this.ticket_qty);
    console.log('Ticket total price: ' + this.totalVal);

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

  sendTr(hostAccount: any, price: any) {
    console.log("hostaccount",hostAccount);
    console.log("current account", this.currentUser);
    console.log("price", price);
    console.log("price in wei", this.web3.utils.toWei(price));
    const weiPrice = this.web3.utils.toWei(price)
    const hexWeiPrice = this.web3.utils.toHex(weiPrice);
    console.log("hexWeiPrice",hexWeiPrice);
    const userWallet = this.currentUser[0].wallet
    console.log("userWallet",userWallet);
    
    if (window.ethereum) {
      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: userWallet,
              to: hostAccount,
              value: hexWeiPrice,
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
    console.log(this.details[0].price, 'this.details price');
    console.log(this.details[0].wallet, 'this.details wallet');

    this.data.set_event(this.details);
    console.log(this.details, 'this.details');
    if (this.details[0].free == 1) this.free = true;
    else this.free = false;
  }

  async filterByCat(categories: any)
  {
    let newArrEvent = []
    this.events = this.copyEvent.slice()
    this.events.forEach((event:any) => {
        categories.forEach(cat => {
          event.categories.find((el:any)=>el.name==cat) != undefined ? newArrEvent.push(event) : null
        });
});

this.events = newArrEvent.slice()
// this.events.push(...newArrEvent)
    
  }

  filterEvent(str: any) {
    console.log(str.target.value);
    this.events = this.events.filter((event) =>
      event.nom.includes(str.target.value)
    );
  }


  async selectFilterCategorie() {
    this.filter = !this.filter;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Select your choice',
      inputs: [
        // {
        //   name: 'Kilometer Range',
        //   type: 'number',
        //   min: 2,
        //   max: 150,
        //   handler: () => {
        //     console.log('Kilometer selected');
        //   },
        //   checked: true
        // },

        {
          name: 'art',
          type: 'checkbox',
          label: 'Art',
          value: 'art',
        },

        {
          name: 'artisanat',
          type: 'checkbox',
          label: 'Artisanat',
          value: 'artisanat',
        },

        {
          name: 'sport',
          type: 'checkbox',
          label: 'Sport',
          value: 'sport',
        },

        {
          name: 'games',
          type: 'checkbox',
          label: 'Games',
          value: 'game',
        },

        {
          name: 'literature',
          type: 'checkbox',
          label: 'Literature',
          value: 'literarture',
        },

        {
          name: 'party',
          type: 'checkbox',
          label: 'Party ',
          value: 'party',
        },
        {
          name: 'cinema',
          type: 'checkbox',
          label: 'Cinema ',
          value: 'cinema',
        },
        {
          name: 'theater',
          type: 'checkbox',
          label: 'Theater',
          value: 'theater',
        },
        {
          name: 'concert',
          type: 'checkbox',
          label: 'Concert',
          value: 'concert',
        },
        {
          name: 'festival',
          type: 'checkbox',
          label: 'Festival',
          value: 'festival',
        },
        {
          name: 'food',
          type: 'checkbox',
          label: 'Food',
          value: 'food',
        },
        {
          name: 'online',
          type: 'checkbox',
          label: 'Online',
          value: 'online',
        },
        {
          name: 'other',
          type: 'checkbox',
          label: 'Other',
          value: 'other',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log("categories select",data);
            if(!!data)
              this.filterByCat(data)
            
          }
        }
      ]
    });

    await alert.present();
  }


  checkChainId() {
    // Create an Observable that will start listening to chain updates
    // when a consumer subscribes.
    const chainId = new Observable((observer) => {
      let watchId: number;
      if (window.ethereum.isConnected()) {
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

  public async getPhotoUrl() {
    console.log("test url fct");
    console.log("event",event);
    console.log(this.events.length),"this.events.length";
    for(let i = 0 ; i < this.events.length ; i++)
    {
      if(this.events[i].firebaseId != null)
      {
        getDownloadURL(ref(this.photos.storage, `photos/events/${this.events[i].firebaseId}`))
        .then((url) => {
          // `url` is the download URL for the user photo
          // this.photoUrl = url
          console.log("url image",  url);
          this.events[i].url = url
          this.photoLoaded = true
          
        })
        .catch((error) => {
          // Handle any errors
          console.log('erreur image');

        });
    }
  }
    console.log("photos url ", this.photosUrl);
    
  }

  async addMarker(lat: any, lng: any, title: string) {
    //add a marker to map
    // const image ="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
    console.log("test marker");
    
    this.markerId = await this.map.addMarker({
      // title: this.details[0].name,
      title: title,
     // snippet: snippet,
      // snippet: this.details[0].description,
      coordinate: {
        lat: lat,
        lng: lng,
      },
       iconUrl: this.photoUrl
      //  iconUrl:this.photoUrl,
      // draggable:true
    });
    // Move the map programmatically to my current position
  }
 

  

  async removeMarker(id?) {
    //add a marker to map
    await this.map.removeMarker(id ? id : this.markerId);
    // await this.map.removeMarker(id ? id :  this.markerEventId);
  }

  async addListeners() {
    //   const image ="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
    //   let infoWindowContent='<div id="content">'+
    //   '<h2 id="firstHeading" class="firstHeading">'+ this.markerId.title +'</h2>'+
    //   '<div>'+ image +'<div>'+
    //  '</div>'
    await this.map.setOnMarkerClickListener((event) => {
      console.log('setOnMarkerClickListener event', event);
      if(event.title != null)
      {
        let currentEvent = this.events.filter(el => el.name == event.title)
        console.log("current event map", currentEvent);
        this.data.set_event(currentEvent[0])
        this.presentModal();
      }
       
      
     // }
    });
    await this.map.setOnMapClickListener((event) => {
      console.log('setOnMapClickListener ', event);
      // this.addMarker(event.latitude,event.longitude);
    });
    await this.map.setOnCameraMoveStartedListener((event) => {
      console.log('setOnCameraMoveStartedListener ', event);

    });
    await this.map.setOnClusterInfoWindowClickListener((event) => {
      console.log('setOnClusterInfoWindowClickListener ', event);

    });
    await this.map.setOnInfoWindowClickListener((event) => {
      console.log('setOnInfoWindowClickListener ', event);

    });


  }

  async presentModal() {
    console.log(event, "event present modal");
    
    const modalPage = await this.modalCtrl.create({
      component: ModalPage,
      componentProps:{
       breakpoints: [0, 0.3, 0.5, 0.8],
       initialBreakpoint: 0.5
      }
      // cssClass: 'custom-modal'
    });
    await modalPage.present();

    this.data.set_modal(modalPage);

    // Optional: Hide the modal after a duration!
    // setTimeout(() => {
    //   modalPage.dismiss();
    // }, 5000);
  }

  async restrictArea() {
    await this.map.enableAccessibilityElements

  }
  async createMap() {
    try {
      const center: any = {
        lat: 43.5297,
        lng: 5.4474,
      };
      this.map = await GoogleMap.create({
        element: this.mapView.nativeElement,
        id: 'capacitor-google-maps',
        apiKey: environment.mapsKey,
        config: {
          center: center,
          zoom: 9,
        },
      });

      // if(Capacitor.getPlatform()!= 'web'){
        // await this.map.enableIndoorMaps(true);
      // }
      
      // this.addMarker(this.center.lat, this.center.lng,'Toulon');
      console.log(this.events, "events map");
      
      this.events.forEach(event => {
        console.log(event,"event map");
        const lat: number = parseFloat(event.lat)
        const lng: number = parseFloat(event.lng)
        console.log(lat,"event map lat");
        console.log(lng,"event map lgt");
        console.log(event.name,"event map name");
        console.log(event.description,"event map description");
        this.addMarker(lat, lng, event.name)
      })
      // this.addMarker(43.147, 6.0731,"la Crau ","Come enjoy");
      // this.addMarker(43.2965,  5.3698,"Marseille","Come enjoy");
      // this.addMarker(48.8566, 2.3522, "Paris","Come enjoy");
      await this.map.enableClustering();

    
     
   
         //FILTER??????????
    
      //  this.showCurrentPosition();
     
     
      this.addListeners();



    } catch (e) {

    }
  }

  //en temps reel jusqu a appelle de la fonction stop
  track() {
    console.log('start tracking you')
    this.wait = Geolocation.watchPosition({}, (position, err) => {
      this.ngZone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

      })
      console.log('latitude position from track:', this.lat)
      console.log('longitude position from track: ', this.lng)
    })

    //  this.stopTracking()
    //  console.log('stop tracking you')
  }

  stopTracking() {
    Geolocation.clearWatch({ id: this.wait });
  }



  async locate() {
    await this.map.setCamera({
      coordinate: {
        lat: this.lat,
        lng: this.lng,
      },
      animate: true
    });
    // this.addMarker(this.lat, this.lng,"My current Position","Come on find me");
  }



  public customFormatter(value: number) {
    return `${value}%`
  }

  returnUrl(){
    return '..\..\event.jpg'
  }

}

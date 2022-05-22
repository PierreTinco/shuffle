import { Component, ElementRef, OnInit, ViewChild ,NgZone} from '@angular/core';
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
import { PhotoService } from '../services/photo.service';
import { getDownloadURL, ref } from 'firebase/storage';

declare let window: any;

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.page.html',
  styleUrls: ['accueil.page.scss'],
})
export class accueilPage implements OnInit {
  infoWindos: any = [];
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
  filter =null;
  totalVal = null;
  wait: any;
  public lat: any;
  public lng: any;
  //maxTicket=this.details[0].max_participant;

  @ViewChild('map') mapView: ElementRef<HTMLElement>;
  map: GoogleMap;
  center: any = {
    lat:42,
    lng: 4,
  };
  title:string;
  markerId: string;
  coords: any ;
  web3 = new Web3(
    'https://ropsten.infura.io/v3/2d0c4c5065844f828e66b7b2f543a119'
  );
  balance1: any;
  free = false;

  constructor(private api: ApiService,public alertController: AlertController,public ngZone: NgZone,private photos: PhotoService,) { }


  async ngOnInit() {
    this.auth = getAuth();
    this.user = this.auth.currentUser;

    const chainObservable: any = null
    console.log('on init accueil');
    this.events = await this.api.getAllEvents({}).toPromise();
    this.currentUser = await this.api.getUser({ where: { token: this.user.uid } }).toPromise()
    console.log(this.currentUser);
    if (window.ethereum) {
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
  ngAfterViewInit() {
    console.log('on ngAfterViewInit')
    this.createMap()
    // this.showCurrentPosition()
    this.track()
    this.stopTracking()
  }

  async participateFree(currentEvent: any) {

    for (let i = 0; i < this.ticket_qty; i++) {
      await this.api.addUserEvent({ id_user: this.currentUser[0].id, id_event: currentEvent.id, statut: "participant" }).subscribe(
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

  async selectFilterCategorie() { 
    this.filter=!this.filter;
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
          value: 'value1',
          handler: () => {
            console.log('Art selected');
          },
          // checked: true
        },

        {
          name: 'artisanat',
          type: 'checkbox',
          label: 'Artisanat',
          value: 'artisanat',
          handler: () => {
            console.log('Artisanat selected');
          }
        },

        {
          name: 'sport',
          type: 'checkbox',
          label: 'Sport',
          value: 'sport',
          handler: () => {
            console.log('Sport selected');
          }
        },

        {
          name: 'games',
          type: 'checkbox',
          label: 'Games',
          value: 'game',
          handler: () => {
            console.log('Checkbox 4 selected');
          }
        },

        {
          name: 'literature',
          type: 'checkbox',
          label: 'Literature',
          value: 'literarture',
          handler: () => {
            console.log('Literature 5 selected');
          }
        },

        {
          name: 'party',
          type: 'checkbox',
          label: 'Party ',
          value: 'party',
          handler: () => {
            console.log('Party selected');
          }
        },
        {
          name: 'cinema',
          type: 'checkbox',
          label: 'Cinema ',
          value: 'cinema',
          handler: () => {
            console.log('Cinema selected');
          }
        },
        {
          name: 'theater',
          type: 'checkbox',
          label: 'Theater',
          value: 'theater',
          handler: () => {
            console.log('Theater selected');
          }
        },
        {
          name: 'concert',
          type: 'checkbox',
          label: 'Concert',
          value: 'concert',
          handler: () => {
            console.log('Concert selected');
          }
        },
        {
          name: 'festival',
          type: 'checkbox',
          label: 'Festival',
          value: 'festival',
          handler: () => {
            console.log('Festival selected');
          }
        },
        {
          name: 'food',
          type: 'checkbox',
          label: 'Food',
          value: 'food',
          handler: () => {
            console.log('Food selected');
          }
        },
        {
          name: 'online',
          type: 'checkbox',
          label: 'Online',
          value: 'online',
          handler: () => {
            console.log('Online selected');
          }
        },
        {
          name: 'other',
          type: 'checkbox',
          label: 'Other',
          value: 'other',
          handler: () => {
            console.log('Other selected');
          }
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
          handler: () => {
            console.log('Confirm Ok');
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

  async createMap() {

    this.map = await GoogleMap.create({
        element: this.mapView.nativeElement,
        id: 'capacitor-google-maps',
        apiKey: environment.mapsKey,
        config: {
          center: this.center,
          zoom: 12,
        },
      });
    // this.addMarker(this.center.lat, this.center.lng,'Toulon');
    this.addMarker(this.lat,this.lng,'CurentPosition')
  }
    //Au moment de l appelle
  async showCurrentPosition() {
    Geolocation.requestPermissions().then(async premission => {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates)
      this.coords = coordinates.coords
      console.log('latitude position From current', this.coords.latitude)
      console.log('longitude position from current:', this.coords.longitude)
      this.addMarker(this.coords.latitude,this.coords.longitude,'CurentPosition')
    }).catch((error) => {
      console.log('Error getting location From Current', error);
    });
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

  public async getPhotoUrl() {
    getDownloadURL(ref(this.photos.storage, `photos/events/$`))
      .then((url) => {
        // `url` is the download URL for the user photo
        this.photoUrl = url
        console.log("url image", this.photoUrl);
      })
      .catch((error) => {
        // Handle any errors
        console.log('erreur image');

      });
  }
  async addMarker(lat: any, lng: any,title: string) {
    //add a marker to map
    const image =this.photoUrl
    const maps=this.map
    this.markerId = await this.map.addMarker({
      title: title,
      coordinate: {
        lat: lat,
        lng: lng,
        
      },
     
        
      // draggable:true
    });

  // This example adds a marker to indicate the position of Bondi Beach in Sydney,
// Australia.
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -33, lng: 151 },
    }
  );


}


  
    // Move the map programmatically to my current position
    await this.map.setCamera({
      coordinate: {
        lat: lat,
        lng: lng,
      }
    });


  }
  async removeMarker(id?) {
    //add a marker to map
    await this.map.removeMarker(id ? id : this.markerId);
  }

  async addListeners() {
    await this.map.setOnMarkerClickListener((event) => {
      console.log('envent markerSetOnclickList ',event);
    });

  }

  draw() {
    //     const points: LatLng[] = [
    //       {
    //         latitude: 51.88,
    //         longitude: 7.60,
    //       },
    //       {
    //         latitude: 55,
    //         longitude: 10,
    //       }
    //     ];

    //     CapacitorGoogleMaps.addPolyline({
    //       points,
    //       color: '#ff00ff',
    //       width: 2
    //     });
  }

 public customFormatter(value: number) {
  return `${value}%`
  }

}

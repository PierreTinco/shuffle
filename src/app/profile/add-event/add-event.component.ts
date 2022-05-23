import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { format, parse, parseISO } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { ActionSheetController, AlertController, AlertInput } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { getDownloadURL } from 'firebase/storage';
import { HttpHandler } from '@angular/common/http';




@Component({
  selector: 'app-add-event',
  templateUrl: 'add-event.component.html',
  styleUrls: ['add-event.component.scss'],
})
export class addEventPage  {
 private categories: AlertInput[] = [{
    name: 'Art',
    type: 'checkbox',
    label: 'Art',
    value: 'art',
    checked: false,
  },{
    name: 'Artisanat',
    type: 'checkbox',
    label: 'Artisanat',
    value: 'artisanat',
    checked: false,
  },{
    type: 'checkbox',
    name: 'sport',
    label: 'Sport',
    value: 'sport',
    checked: false,
  },{
    type: 'checkbox',
    name: 'Games',
    label: 'Games',
    value: 'game',
    checked: false,
  },{
    type: 'checkbox',
    name: 'literature',
    label: 'Literature',
    value: 'literarture',
    checked: false,
  },{
    type: 'checkbox',
    name: 'party',
    label: 'Party ',
    value: 'party',
    checked: false,
  },{
    type: 'checkbox',
    name: 'cinema',
    label: 'Cinema ',
    value: 'cinema',
    checked: false,
  },{
    type: 'checkbox',
    name: 'theater',
    label: 'Theater',
    value: 'theater',
    checked: false,
  },
  {
    type: 'checkbox',
    name: 'concert',
    label: 'Concert',
    value: 'concert',
    checked: false,
  },
  {
    type: 'checkbox',
    name: 'festival',
    label: 'Festival',
    value: 'festival',
    checked: false,
  },
  {
    type: 'checkbox',
    name: 'food',
    label: 'Food',
    value: 'food',
    checked: false,
  },
  {
    type: 'checkbox',
    name: 'online',
    label: 'Online',
    value: 'online',
    checked: false,
  },
  {
    type: 'checkbox',
    name: 'other',
    label: 'Other',
    value: 'other',
    checked: false,
  }]

  private address: AlertInput[] = [{
    name: 'number',
    type: 'text',
    value: '',
    label: 'Number',
    placeholder: 'Number',
  },
  {
    name: 'street',
    type: 'text',
    value: '',
    label: 'Street',
    placeholder: 'Street',
  },
  {
    type: 'text',
    name: 'postalCode',
    value: '',
    label: 'Postal Code',
    placeholder: 'Postal Code',
    
  },
  {
    type: 'text',
    name: 'city',
    value: '',
    label: 'City',
    placeholder: 'City'
  },
  {
    type: 'text',
    name: 'country',
    value: '',
    label: 'Country',
    placeholder: 'Country'
  }]
  user: any
  submitted: boolean;
  isAddingMode = false;
  isViewingMode = false;
  isPayingMode = false;
  searchText = '';
  user_event: any;
  event: any = {
    name: '',
    description: '',
    location: '',
    street: '',
    number: '',
    postal_code: '',
    city: '',
    country: '',
    date_start: '',
    time_start: '',
    date_end: '',
    time_end: '',
    price: null,
    max_participant: null,
    age_min: '',
    note: '',
    wallet: '',
    categories: [],
  };
  public = false;
  free = true;
  photo: any;
  position: any;
  idUser: any
  coords: any ;

  photoUrl: string;
  photoLoaded: boolean;
  categoriesSelected = [];
  filter: boolean;
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  lng: any;
  lat: any;

  constructor(private api: ApiService, public pic: PhotoService, public actionSheetController: ActionSheetController, private route: ActivatedRoute,private  nativeGeocoder:NativeGeocoder, public alertController: AlertController) { }


  async ngOnInit() {
    this.idUser = this.route.snapshot.paramMap.get('id')
  }




  validForm() {
    this.event.date_start = this.formatDate(this.event.date_start)
    this.event.date_end = this.formatDate(this.event.date_end)
    this.free == true ? (this.event['free'] = 1) : (this.event['free'] = 0);
    this.public == false
      ? (this.event['public'] = 1)
      : (this.event['public'] = 0);
    this.event.price == null ? delete this.event.price : null;
    console.log(this.event);
   this.addEvent()

  }

  async addEvent() {
    this.free == true ? (this.event['free'] = 1) : (this.event['free'] = 0);
    this.public == false
      ? (this.event['public'] = 1)
      : (this.event['public'] = 0);
    this.event.price == null ? delete this.event.price : null;
    this.event.categories = this.categoriesSelected;
    await this.api.addEvents(this.event).subscribe(
      (res: any) => {
        alert("Event ajouté à l'application");
        this.api.addUserEvent({ id_user: this.idUser, id_event: res.insertId, status: 'creator' }).subscribe(
          (res) => {
            alert('ok userEvent')
          }
        )
      },
      (err) => {
        alert('Il y a eu une erreur');
        console.log("erreur addevent", err);
      }
    );
  }

  isAddingModeHandler() {
    this.isAddingMode = true;
  }
  isViewingModeHandler() {
    this.isViewingMode = true;
  }
  isPayingModeHandler() {
    this.isPayingMode = !this.isPayingMode;
  }

  return() {
    this.isViewingMode = false;
  }

  filterEvent(str: any) {
    console.log(str.target.value);

    this.event = this.event.filter((event) =>
      event.nom.includes(str.target.value)
    );
  }

  formatDate(value: string) {
    return format(parseISO(value), 'yyyyddMM');
  }

  async showCurrentPosition() {
    Geolocation.requestPermissions().then(async premission => {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates)
      this.coords = coordinates.coords
      console.log('latitude position:', this.coords.latitude)
      console.log('longitude position:', this.coords.longitude)
      this.lat=this.coords.latitude
      this.lng=this.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async geocoderNative() {
    if (this.event.location != "") {
            //TranslateCoordonneesGps
    this.nativeGeocoder.forwardGeocode(this.event.location, this.options)
    .then((result: NativeGeocoderResult[]) => {
      console.log('lat=' + result[0].latitude + 'long=' + result[0].longitude);
    })
    .catch((error: any) => console.log('Geocode',error));
   
    }
    else{
      this.showCurrentPosition()       
    //TranslateCoordonneesGps
     this.nativeGeocoder.reverseGeocode(this.lat, this.lng, this.options)
     .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
     .catch((error: any) => console.log('reverseGeocode', error));
 
    }


  }
    //en temps reel jusqu a appelle de la fonction stop
    // track() {
    //   console.log('start tracking you')
    //   this.wait = Geolocation.watchPosition({}, (position, err) => {
    //     this.ngZone.run(() => {
    //       this.lat = position.coords.latitude;
    //       this.lng = position.coords.longitude;

    //     })
    //     console.log('latitude position from track:', this.lat)
    //     console.log('longitude position from track: ', this.lng)
    //   })

    //   //  this.stopTracking()
    //   //  console.log('stop tracking you')
    // }

    // stopTracking() {
    //   Geolocation.clearWatch({ id: this.wait });
    // }

  public async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change event photo',
      buttons: [{
        text: 'New event photo',
        role: 'changement',
        icon: 'camera',
        handler: () => {
          this.pic.chooseEventPicture();
          this.pic.loadSaved();
          this.getPhotoUrl()
          console.log('Confirm Changement');
        }
      }, {
        text: 'Remove event photo',
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
          console.log('Confirm Cancel');
        }
      }]
    });
    await actionSheet.present();
  }

  public async getPhotoUrl() {
    if (this.pic.photoLoaded) {
      getDownloadURL(this.pic.eventImageRef)
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


    async filterCategorie() { 
      this.filter=!this.filter;
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Select your choice',
        inputs: this.categories,
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
            this.categoriesSelected = data;
            console.log("categories selected",this.categoriesSelected);
            
            }
          }
        ]
      });
      await alert.present();
    }

    async selectAddress() { 
      this.filter=!this.filter;
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Enter you address',
        inputs: this.address,
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
              console.log(data);
              
            this.event.number = data.nnumber;
            this.event.street = data.street;
            this.event.postal_code = data.postalCode;
            this.event.city = data.city;
            this.event.country = data.country;
            console.log("adress",this.event);
            
            }
          }
        ]
      });
      await alert.present();
    }
}

// constructor(private toast: Toast) { }

// ...

// this.toast.show(`I'm a toast`, '5000', 'center').subscribe(
//   toast => {
//     console.log(toast);
//   }
// );

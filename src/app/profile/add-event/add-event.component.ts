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
import { DataStorageService } from 'src/app/services/datastorage.service';




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
    label: 'Number',
    placeholder: 'Number',
  },
  {
    name: 'street',
    type: 'text',
    label: 'Street',
    placeholder: 'Street',
  },
  {
    type: 'text',
    name: 'postalCode',
    label: 'Postal Code',
    placeholder: 'Postal Code',
    
  },
  {
    type: 'text',
    name: 'city',
    label: 'City',
    placeholder: 'City'
  },
  {
    type: 'text',
    name: 'country',
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
    date_start: '',
    time_start: '',
    date_end: '',
    time_end: '',
    price: '',
    max_participant: null,
    age_min: '',
    note: '',
    wallet: '',
    lat: '',
    lng: '',
    timestamp: '',
  };
  public = false;
  free = true;
  photo: any;
  position: any;
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
  resultLat: string;
  resultLng: string;
  resultAdress: string[];
  resultAdressNum: string;


  constructor(private api: ApiService, public pic: PhotoService, public actionSheetController: ActionSheetController, private route: ActivatedRoute,private  nativeGeocoder:NativeGeocoder, public alertController: AlertController, private data: DataStorageService) { }


  async ngOnInit() {
    this.user = this.data.get_user()
    console.log("id user", this.user);
    
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
    this.event.timestamp = this.pic.createdAt
    console.log(this.event.timestamp, "event timestamp");
    
    await this.api.addEvents(this.event).subscribe(
      (res: any) => {
        alert("Event ajouté à l'application");

        this.api.addUserEvent({ id_user: this.user.id, id_event: res.insertId, statut: 'creator' }).subscribe(
          (res) => {
            console.log("event price ",this.event.price);
            alert('ok userEvent')
            
          }
        )
        console.log(this.categoriesSelected.length)
        for(let i = 0; i < this.categoriesSelected.length ; i++)
        {
          this.api.addCategory({ name: this.categoriesSelected[i], id_event: res.insertId}).subscribe(
            (res) => {
              console.log("categorie ok");
              
            }
          )
        }
        
        
        window.location.reload();
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
            //TranslateAdresse
    this.nativeGeocoder.forwardGeocode(this.event.location, this.options)
    .then((result: NativeGeocoderResult[]) => {
      console.log('TranslateAdresse in lat=' + result[0].latitude + 'long=' + result[0].longitude);
      this.resultLat=result[0].latitude;
      this.resultLng=result[0].longitude;
      this.event.lat = this.resultLat
      this.event.lng = this.resultLng
    })
    .catch((error: any) => console.log('Geocode',error));
   
    }
    else{
      this.showCurrentPosition()       
    //TranslateCoordonneesGps
     this.nativeGeocoder.reverseGeocode(this.lat, this.lng, this.options)
     .then((result: NativeGeocoderResult[]) =>{ 
      console.log("TranslateCoordonneesGps",JSON.stringify(result[0]));
     console.log('Adresse in lat=' + result[0].latitude + 'long=' + result[0].longitude);
     this.resultLat=result[0].latitude;
     this.resultLng=result[0].longitude;
     this.resultAdress=result[0].areasOfInterest;
     this.resultAdressNum=result[0].subThoroughfare;

    })
     .catch((error: any) => console.log('reverseGeocode', error));
 
    }


  }


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

    
}

// constructor(private toast: Toast) { }

// ...

// this.toast.show(`I'm a toast`, '5000', 'center').subscribe(
//   toast => {
//     console.log(toast);
//   }
// );

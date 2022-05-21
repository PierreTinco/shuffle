import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { format, parse, parseISO } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { getDownloadURL } from 'firebase/storage';




@Component({
  selector: 'app-add-event',
  templateUrl: 'add-event.component.html',
  styleUrls: ['add-event.component.scss'],
})
export class addEventPage  {
  categories = [{cat:"art", checked: false},{cat:"artisanat", checked: false},{cat:"games", checked: false},{cat:"sport", checked: false},{cat:"music", checked: false},{cat:"literature", checked: false},{cat:"party", checked: false},{cat:"cinema", checked: false},{cat:"theater", checked: false},{cat:"concert", checked: false},{cat:"festival", checked: false},{cat:"food", checked: false},{cat:"online", checked: false},{cat:"other", checked: false}]
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
    street: '',
    number: '',
    postal: '',
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
  };
  public = false;
  free = true;
  photo: any;
  position: any;
  idUser: any
  coords: any ;

  photoUrl: string;
  photoLoaded: boolean;
  nativeGeocoder: any;
  categoriesSelected: any;

  constructor(private api: ApiService, public pic: PhotoService, public actionSheetController: ActionSheetController, private route: ActivatedRoute) { }


  async ngOnInit() {
    this.idUser = this.route.snapshot.paramMap.get('id')    
  }


 

  validForm() {
    // this.event.date_start = this.formatDate(this.event.date_start)
    // this.event.date_end = this.formatDate(this.event.date_end)
    this.free == true ? (this.event['free'] = 1) : (this.event['free'] = 0);
    this.public == false
      ? (this.event['public'] = 1)
      : (this.event['public'] = 0);
    this.event.price == null ? delete this.event.price : null;
    console.log(this.event);

  }

  async addEvent() {
    // this.event.date_start = this.formatDate(this.event.date_start)
    // this.event.date_end = this.formatDate(this.event.date_end)
    this.free == true ? (this.event['free'] = 1) : (this.event['free'] = 0);
    this.public == false
      ? (this.event['public'] = 1)
      : (this.event['public'] = 0);
    this.event.price == null ? delete this.event.price : null;
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
        this.coords=coordinates.coords
        console.log('latitude position:', this.coords.latitude) 
        console.log('longitude position:', this.coords.latitude) 
      
     }).catch((error) => {
      console.log('Error getting location', error);
    });
   }
  geocoderNative(){
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
  };
  
  this.nativeGeocoder.reverseGeocode(this.coords.latitude, this.coords.latitude, options)
    .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
    .catch((error: any) => console.log(error));
  
  this.nativeGeocoder.forwardGeocode(this.event.location, options)
    .then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
    .catch((error: any) => console.log(error));
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

  public async getPhotoUrl(){  
    if(this.pic.photoLoaded)
    {
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

  addCategories(category: any) {
    console.log("test cat");
    
    console.log(category, category.checked, 'categorie');
    this.categoriesSelected = this.categories.filter((res) => res.checked == true);
    console.log(this.categoriesSelected, 'categoriesSelected');
  }
}

// constructor(private toast: Toast) { }

// ...

// this.toast.show(`I'm a toast`, '5000', 'center').subscribe(
//   toast => {
//     console.log(toast);
//   }
// );

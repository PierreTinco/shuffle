import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { format, parseISO } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule, AbstractControl} from '@angular/forms';
import { PhotoService } from 'src/app/services/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { getDownloadURL } from 'firebase/storage';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';



@Component({
  selector: 'app-add-event',
  templateUrl: 'add-event.component.html',
  styleUrls: ['add-event.component.scss'],
})
export class addEventPage  {
  user: any
  submitted: boolean;
  isAddingMode = false;
  isViewingMode = false;
  isPayingMode = false;
  public myForm: FormGroup;
  searchText = '';
  user_event: any;
  event: any = {
    name: '',
    description: '',
    location: '',
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
   idUser: any
  photoUrl: string;
  coords: any ;
  position: any;
  nativeGeocoder: any;

  constructor(private api: ApiService, public pic: PhotoService, public actionSheetController: ActionSheetController, private route: ActivatedRoute, private fb: FormBuilder) { }


  async ngOnInit() {
    this.idUser = this.route.snapshot.paramMap.get('id')
    this.initForm()
    this.myForm.valueChanges.subscribe(data => console.log('form changes 1', data));
    this.myForm.valueChanges.subscribe(el => {
      console.log('my Form validity 1', this.myForm.valid);
    })
    
    
  }

  initForm(): void {
    this.myForm = this.fb.group({
      event: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
        description: ['',null],
        location: ['', [Validators.required]],
        date_start: ['', [Validators.required]],
        time_start: ['', [Validators.required]],
        date_end: ['', [Validators.required]],
        time_end: ['', [Validators.required]],
        price: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        max_participant: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        age_min: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        wallet: ['', [Validators.required]]
      }),
      public: ["true",Validators.required],
      free: ["true", Validators.required],
    },{validator: this.checkCheckbox});
  }

  checkCheckbox(c: AbstractControl){
    if(c.get('public').value == false){
        return false;
    }
    if(c.get('free').value == false){
      return false;
  }else return true;
} 

  validForm() {
    console.log('form changes', this.myForm.value);
    console.log('my Form validity', this.myForm.valid);
    console.log('form control',this.myForm.controls);
    this.myForm.get('public').valueChanges.subscribe((val) => console.log("privacy",val));


    this.submitted = true;

    if (!this.myForm.valid) {
      console.log('All fields are required.')
      alert('Please provide all the required fields.')

      return false;
    } else {
      console.log(this.myForm.value)
      this.addEvent()
    }
  }

  async addEvent() {
    const userEvent = null
    this.myForm.value.event.date_start = format(parseISO(this.myForm.value.event.date_start), 'MMM dd yyyy')
    this.myForm.value.event.date_end = this.formatDate(this.myForm.value.event.date_end)
    this.myForm.value.free == true ? (this.myForm.value.event['free'] = true) : (this.myForm.value.event['free'] = false);
    this.public == false
      ? (this.myForm.value.event['public'] = true)
      : (this.myForm.value.event['public'] = false);
    this.myForm.value.event.price == null ? delete this.myForm.value.event.price : null;
    
    await this.api.addEvents(this.myForm.value.event).subscribe(
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
      }
    );
  }
  get errorControl() {
    return this.myForm.controls;
  }

  async updateEvent(event: number) {
    // await this.api.updateEvents(event).subscribe((res) => {
    //   alert("Event ajouté à l'application")
    // }, err => {
    //   alert("Il y a eu une erreur")
    // })
  }


  async deleteEvent(event: any) {
    // await this.api.deleteEvents(event).subscribe(
    //   (res) => {
    //     alert('Event supprimé');
    //   },
    //   (err) => {
    //     alert('Il y a eu une erreur');
    //   }
    // );
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
    return format(parseISO(value), 'yyyyddmm');
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
    
      })
      .catch((error) => {
        // Handle any errors
        console.log('erreur image');
        
      });
    }  
  } 
}

// constructor(private toast: Toast) { }

// ...

// this.toast.show(`I'm a toast`, '5000', 'center').subscribe(
//   toast => {
//     console.log(toast);
//   }
// );

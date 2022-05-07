import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { format, parseISO } from 'date-fns';
import { Firestore, doc, setDoc } from '@angular/fire/firestore'
import { ref, Storage, getDownloadURL, uploadString } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActivatedRoute } from '@angular/router';
import { DataStorageService } from 'src/app/services/datastorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoService, UserPhoto } from 'src/app/services/photo.service';
import { User } from 'firebase/auth';
import { ActionSheetController } from '@ionic/angular';



@Component({
  selector: 'app-add-event',
  templateUrl: 'add-event.component.html',
  styleUrls: ['add-event.component.scss'],
})
export class addEventPage {
  submitted: boolean;
  userRef: any
  user: User
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
  position: any;
  idUser: any

  constructor(private api: ApiService, public pic: PhotoService, public actionSheetController: ActionSheetController, private route: ActivatedRoute, private fb: FormBuilder) { }

  async ngOnInit() {
    this.idUser = this.route.snapshot.paramMap.get('id')
    //   , private firestore: Firestore, private storage: Storage
    // this.userRef = doc(this.firestore, `users/${this.user.uid}`)
    await this.pic.loadSaved();
    this.initForm()
    this.myForm.valueChanges.subscribe(data => console.log('form changes', data));
    this.myForm.valueChanges.subscribe(el => {
      console.log('my Form validity', this.myForm.valid);
    })
  }

  initForm(): void {
    this.myForm = this.fb.group({
      public: ['', [Validators.required]],
      free: ['', [Validators.required]],
      event: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(50)]],
        location: ['', [Validators.required]],
        date_start: ['', [Validators.required]],
        time_start: ['', [Validators.required]],
        date_end: ['', [Validators.required]],
        time_end: ['', [Validators.required]],
        price: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]$')]],
        max_participant: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]$')]],
        age_min: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]$')]],
        wallet: ['', [Validators.required]],
      })
    });
  }

  validForm() {
    console.log('my Form validity', this.myForm.valid)
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
    this.myForm.value.free == true ? (this.myForm.value.event['free'] = 1) : (this.myForm.value.event['free'] = 0);
    this.public == false
      ? (this.myForm.value.event['public'] = 1)
      : (this.myForm.value.event['public'] = 0);
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
    return format(parseISO(value), 'MMM dd yyyy');
  }

  public async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change profile photo',
      buttons: [{
        text: 'New profile photo',
        role: 'changement',
        icon: 'camera',
        handler: () => {
          this.pic.choosePicture();
          console.log('Confirm Changement');
        }
      }, {
        text: 'Remove profile photo',
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
         // Nothing to do, action sheet is automatically closed
          console.log('Confirm Cancel');
        }
      }]
    });
    await actionSheet.present();
  }
}

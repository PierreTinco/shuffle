import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { format, parseISO } from 'date-fns';
import { Firestore, doc, setDoc } from '@angular/fire/firestore'
import { ref, Storage, getDownloadURL, uploadString } from '@angular/fire/storage';
import {  getAuth, User } from 'firebase/auth';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActivatedRoute } from '@angular/router';
import { DataStorageService } from 'src/app/services/datastorage.service';



@Component({
  selector: 'app-add-event',
  templateUrl: 'add-event.component.html',
  styleUrls: ['add-event.component.scss'],
})
export class addEventPage {
  userRef: any
  user: User
  isAddingMode = false;
  isViewingMode = false;
  isPayingMode = false;
  searchText = '';
  user_event: any;
  event: any = {
    name: '',
    description: '',
    location: '',
    date_start: '',
    time_start: '',
    date_end:'',
    time_end:'',
    price: null,
    max_participant: null,
    age_min: '',
    note: '',
    wallet: '',
  };
  public = false;
  free = true;  
  idUser: any

  constructor(private api: ApiService, private route: ActivatedRoute,private dataStorageService : DataStorageService) {}

  async ngOnInit() {
    this.idUser = this.dataStorageService.getid_user_creator()
    //,private firestore: Firestore,  private storage: Storage
    //this.userRef = doc(this.firestore, `users/${this.user.uid}`)
    //await this.api.loadSaved();

    

  }



  async addEvent() {
    const userEvent = null
    this.event.date_start = format(parseISO(this.event.date_start), 'MMM dd yyyy')
    this.event.date_end = this.formatDate(this.event.date_end)
    this.free == true ? (this.event['free'] = 1) : (this.event['free'] = 0);
    this.public == false
      ? (this.event['public'] = 1)
      : (this.event['public'] = 0);
    this.event.price == null ? delete this.event.price : null;
    await this.api.addEvents(this.event).subscribe(
      (res :any) => {
        alert("Event ajouté à l'application");
        this.api.addUserEvent({id_user: this.idUser,id_event: res.insertId,status : "creator"}).subscribe(
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
    // await this.api.updateEvents(event).subscribe((res)=>{
    //       alert("Event ajouté à l'application")
    // },err=>{
    //   alert("Il y a eu une erreur")
    // })
  }
  
  
  // async deleteEvent(event: any) {
  //   await this.api.deleteEvents(event).subscribe(
  //     (res) => {
  //       alert('Event supprimé');
  //     },
  //     (err) => {
  //       alert('Il y a eu une erreur');
  //     }
  //   );
  // }



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

  async changeImg() {
    const img = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
  }
}


//  async addPhoto(cameraFile: Photo) {
//   const storageRef = ref(this.storage, `upload/${this.user.uid}/profile.png`)
//    // await this.api.choosePicture();
//    try{
//     await uploadString(storageRef, cameraFile.base64String)
//     const imageUrl = await getDownloadURL(storageRef)
//     await setDoc(this.userRef, {
//       imageUrl
//     });
//     return true
//    }
//    catch{
//      return null
//    }
//   }
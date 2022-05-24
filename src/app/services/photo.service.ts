import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { DataStorageService } from './datastorage.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  user: any;
  public imageUrl: string
  public profileImageRef: any;
  public eventImageRef: any;
  public photos: UserPhoto[];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  private firebaseApp = getApp();
  public storage = getStorage(this.firebaseApp, "gs://shuffle-de86f.appspot.com");
  createdAt: any;
  photoLoaded: boolean;
  firebaseId: any

  constructor(platform: Platform, private data: DataStorageService) {


  this.platform = platform; }
  getfirebaseid(){
    return this.firebaseId
  }
  public async chooseProfilePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri
    
    });
    console.log("ici l'image",image);
    
    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(image);
    console.log("image saved:",savedImageFile);
    //this.photos.unshift(savedImageFile);
    this.user = this.data.get_user()
    console.log("user pour photo", this.user);
    this.profileImageRef = ref(this.storage, `photos/users/${this.user.id}`)
    console.log(this.profileImageRef);
    
    const response = await fetch(savedImageFile.webviewPath);
    const blob = await response.blob();
    uploadBytes(this.profileImageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!',snapshot);
    });

     // Cache all photo data for future retrieval
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  public async chooseEventPicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri
    
    });
    console.log("ici l'image",image);
    
    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(image);
    console.log("image saved:",savedImageFile);
    //this.photos.unshift(savedImageFile);
    this.user = this.data.get_user()
    this.createdAt = new Date().getTime()
    console.log("timestamp",this.createdAt);
    console.log(this.user.id);
    this.photoLoaded = true
    let id = Math.random().toString(36).slice(2, 7);
    this.firebaseId = id
    this.eventImageRef = ref(this.storage, `photos/events/${id}`)
    console.log("ref Image:", this.eventImageRef);
    const response = await fetch(savedImageFile.webviewPath);
    const blob = await response.blob();
    uploadBytes(this.eventImageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!',snapshot);
    });

     // Cache all photo data for future retrieval
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data:  base64Data,
      directory: Directory.Data
    });
  
    if (this.platform.is('hybrid')) {
     // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
   }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
     return {
       filepath: fileName,
       webviewPath: photo.webPath
     };
   }
 }

  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
      path: photo.path
       });

      return file.data;
    }
   else {
       // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath);
    const blob = await response.blob();

     return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
     // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
   // Easiest way to detect when running on the web:
  // “when the platform is NOT hybrid, do this”
     if (!this.platform.is('hybrid')) {
    // Display the photo by reading into base64 format
       for (let photo of this.photos) {
         // Read each saved photo's data from the Filesystem
          const readFile = await Filesystem.readFile({
             path: photo.filepath,
             directory: Directory.Data
          });

       // Web platform only: Load the photo as base64 data
          photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
          console.log("photo base64",photo.webviewPath );
          
       }
     }
 }

   public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

  // Update photos array cache by overwriting the existing photo array
     Storage.set({
       key: this.PHOTO_STORAGE,
       value: JSON.stringify(this.photos),
     });

  // delete photo file from filesystem
   const filename = photo.filepath
                      .substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }



}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}



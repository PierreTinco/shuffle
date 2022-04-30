import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor() { }

  id_user_creator : any
  followerClickString : string

  getid_user_creator(){
    return this.id_user_creator
  }

  setid_user_creator(nb : any){
    this.id_user_creator = nb
  }


  getfollowerClickString(){
    return this.followerClickString
  }

  setfollowerClickString(str : string){
    this.followerClickString = str
  }
}

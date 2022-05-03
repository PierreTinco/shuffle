import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor() { }
  user: any
  id_user_creator : any
  followerClickString : string

  get_user() {
    return this.user
  }

  set_user(user: any) {
    this.user = user
  }

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

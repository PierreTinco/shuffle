import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  event: Event;
  modal: any;

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

  get_event() {
   return  this.event
  }

  set_event(event: any) {
    this.event = event
  }

  get_modal() {
    return  this.modal
   }
 
   set_modal(modal: any) {
     this.modal = modal
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

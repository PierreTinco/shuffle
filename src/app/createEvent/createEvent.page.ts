import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-createEvent',
  templateUrl: 'createEvent.page.html',
  styleUrls: ['createEvent.page.scss']
})
export class createEventPage {
  isAddingMode = false
  isViewingMode = false
  isPayingMode = false
 
 user_event :any
  event :any = {
    name: "",
    description : "",
    location: "",
    date_start :"",
    time_start: "",
    price : null,
    date_end:"",
    max_participant	:null,
    age_min : "",
    note : "",
    wallet : ""
  } 
  public = false
  free = true

  async ngOnInit(){

    }

  async addEvent( ){
    this.free == true ? this.event["free"] = 1 : this.event["free"] = 0 
    this.public == false ? this.event["public"] = 1 : this.event["public"] = 0
    this.event.price == null ? delete this.event.price : null 
    await this.api.addEvents(this.event).subscribe((res)=>{
          alert("Event ajouté à l'application")
    },err=>{
      alert("Il y a eu une erreur")
    })
  
  }
async updateEvent( event: number ){
  // await this.api.updateEvents(event).subscribe((res)=>{
  //       alert("Event ajouté à l'application")
  // },err=>{
  //   alert("Il y a eu une erreur")
  // })
  
}
async deleteEvent( event: any ){
  await this.api.deleteEvents(event).subscribe((res)=>{
        alert("Event ajouté à l'application")
  },err=>{
    alert("Il y a eu une erreur")
  })
  
}


  constructor(private api : ApiService) {}
  searchText = ""
  




  isAddingModeHandler(){

    this.isAddingMode = true
  }
  isViewingModeHandler(){

    this.isViewingMode = true
  }
  isPayingModeHandler(){
    this.isPayingMode =! this.isPayingMode
  }
  
  return(){
    this.isViewingMode = false
  }

  filterEvent(str : any){
    console.log(str.target.value)
    
    this.event = this.event.filter((event)=>event.nom.includes(str.target.value))
    }

}
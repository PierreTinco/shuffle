import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  isAddingMode = false
  isViewingMode = false
  isPayingMode = false
 
 
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
    this.free== true ? this.event["free"] = 1 : this.event["free"] = 0 
    this.public == false ? this.event["public"] = 1 : this.event["public"] = 0
    this.event.price==null ? delete this.event.price : null
    await this.api.addEvents(this.event).subscribe((res)=>{
          alert("Event ajouté à l'application")
    },err=>{
      alert("Il y a eu une erreur")
    })
  
  }
// async updateEvent( event: any ){
//   await this.api.updateEvents(event).subscribe((res)=>{
//         alert("Event ajouté à l'application")
//   },err=>{
//     alert("Il y a eu une erreur")
//   })
  
// }
// async deleteEvent( event: any ){
//   await this.api.deleteEvents(event).subscribe((res)=>{
//         alert("Event ajouté à l'application")
//   },err=>{
//     alert("Il y a eu une erreur")
//   })
  
// }


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
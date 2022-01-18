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
    nom: "",
    description : "",
    date_debut :"",
    heure_debut: "",
    prix : null,
    date_fin:"",
    max_participant	:null,
    age_min : "",
    note : ""
  } 
  public = false
  payant = false

  async ngOnInit(){
    this.event = await this.api.getAllEvents().toPromise()
    }

  async addEvent( ){
    this.payant==true ? this.event["payant"] = 1 : this.event["payant"] =0
    this.public == true ? this.event["public"] = 1 : this.event["public"] = 0
    this.event.prix==null ? delete this.event.prix : null
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
    this.isPayingMode = true
  }
  
  filterEvent(str : any){
    console.log(str.target.value)
    
    this.event = this.event.filter((event)=>event.nom.includes(str.target.value))
    }

}
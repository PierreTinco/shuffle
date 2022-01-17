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

event = {
  nom : "",
  description : "",
  date_debut :"",
  heure_debut: "",
  payant : null,
  price : null,
  public : null,
  date_fin:"",
  max_participant	:null,
  age_min : ""
}
async addEvent( event: any ){
  await this.api.addEvents(event).subscribe((res)=>{
        alert("Event ajouté à l'application")
  },err=>{
    alert("Il y a eu une erreur")
  })
  
}

constructor(private api : ApiService) {}


  isAddingModeHandler(){

    this.isAddingMode = true
  }
  isViewingModeHandler(){

    this.isViewingMode = true
  }
  isPayingModeHandler(){
    this.isPayingMode = true
  }
  async ngOnInit(){
    
    }
}

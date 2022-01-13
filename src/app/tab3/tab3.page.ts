import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  isAddingMode = false
event = {
  nom : "",
  date_debut :"",
  payant : null,
  public : null,
  date_fin:"",
  max_participant	:null
}
  constructor() {}


  isAddingModeHandler(){

    this.isAddingMode = true
  }
  async ngOnInit(){
    
    }
}

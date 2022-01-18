import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {Event} from './tab2.model';
declare let window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  details:any
  events :any
  // details =
  //   {
  //     id: "",
  //     nom: "",
  //     description : "",
  //     date_debut :"",
  //     heure_debut: "",
  //     prix : null,
  //     date_fin:"",
  //     max_participant	:null,
  //     age_min : "",
  //     note : "",
  //     public: false,
  //     payant: false 
  // }
  clicked = false
  connected = false 
  constructor(private api : ApiService) {

  }
  
  account = [];
  searchText = ""



  connectWallet (){
    if (window.ethereum)
    {
      window.ethereum.request({method: 'eth_requestAccounts', params: []})
      .then((res)=>this.account=res)
      if (this.account != null)
        this.connected = true;
    }
  }
 return(){
   this.clicked=false
 }
  sendTr() {
    if(window.ethereum){    
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: this.account[0],
          to: '0x4967A396e284a074Cf779c758A9F8F77Bb2cC01B',
          value: '1000000000000000',
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((_error: any) => console.error);}

}
  viewMore(id :any){
    console.log(id,"id de levent que lon veut ouvrir")
    this.clicked=!this.clicked
    this.details = this.events.filter((event)=>event.id==id)
    console.log(this.details,"this.details")
  }
  filterEvent(str : any){
    console.log(str.target.value)
    this.events = this.events.filter((event)=>event.nom.includes(str.target.value))
  }


  async ngOnInit(){
    this.events = await this.api.getAllEvents().toPromise()
    console.log(this.details);
  }
}

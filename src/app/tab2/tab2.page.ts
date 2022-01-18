import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
declare let window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(private api : ApiService) {

  }
  events_array :any = []
  account = [];
  searchText = ""


  connectWallet (){
    if (window.ethereum)
    {
      window.ethereum.request({method: 'eth_requestAccounts', params: []})
      .then((res)=>this.account=res)
    }
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

  filterEvent(str : any){
    console.log(str.target.value)

    this.events_array = this.events_array.filter((event)=>event.nom.includes(str.target.value))
  }

  // getEventId(eventId: string){
  //   return ...this.events_array.find(this.event)
  // }

  async ngOnInit(){
  this.events_array = await this.api.getAllEvents().toPromise()
  }
}

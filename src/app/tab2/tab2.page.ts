import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(private api : ApiService) {}
events_array :any = []

searchText = ""




filterEvent(str : any){
console.log(str.target.value)

this.events_array = this.events_array.filter((event)=>event.nom.includes(str.target.value))
}

async ngOnInit(){
this.events_array = await this.api.getAllEvents().toPromise()
}

}

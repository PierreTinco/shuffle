import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../services/datastorage.service';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.page.html',
  styleUrls: ['./follow.page.scss'],
})
export class FollowPage implements OnInit {
  segmentModel ="";
  constructor(private dataStorageService : DataStorageService) { }

  ngOnInit() {
    this.segmentModel = this.dataStorageService.getfollowerClickString()
  }


  buttonsChanged(event:any) {
    this.segmentModel=event.target.value;
    console.log(this.segmentModel);
      
    console.log('event:' ,event);
    

  }
}

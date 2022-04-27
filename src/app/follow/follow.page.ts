import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.page.html',
  styleUrls: ['./follow.page.scss'],
})
export class FollowPage implements OnInit {
  segmentModel ="follow";
  constructor() { }

  ngOnInit() {
  }


  buttonsChanged(event:any) {
    this.segmentModel=event.target.value;
    console.log(this.segmentModel);
      
    console.log('event:' ,event);
    

  }
}

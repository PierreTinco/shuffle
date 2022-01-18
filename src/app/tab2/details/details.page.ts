import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  loadedDetails: Event;
  constructor(
    private activatedRoute: ActivatedRoute) { }
    private api : ApiService
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap =>{
      if (!paramMap.has('tab2Id')) {
        // redirect
        return;
      }
      const tab2Id = paramMap.get('tab2Id');

    });
  }

  

}

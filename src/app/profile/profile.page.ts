import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  app: any
  currentUser: any
  user: any
  users: any 
  auth: any
  buttonValue = 'grid';
  connected = false
  buttonEvents: any[] = [];
  clicked = false

  constructor(private api: ApiService) { }

  async ngOnInit() {
    this.auth = getAuth()
    this.user = this.auth.currentUser
    this.users = await this.api.getUser().toPromise()
    if (this.user != null )
    {
      this.connected = true
    }
    this.buttonEvents = [
      {value: 'grid', icon:'grid'},
      {value: 'reels', icon:'shuffle'}
    ]
  }

  
  buttonsChanged() {

  }

  getUser() {

      console.log(this.user);
      
  }

  logOut() {
    signOut(this.auth).then(() => {
      // Sign-out successful.
      alert('deconnexion')
    }).catch((error) => {
      // An error happened.
      alert('erreur')

    });
  }

  filterUser() {
    const userToken = this.user.getIdToken()
    this.currentUser = this.users.filter((users) =>
      users.token.includes(userToken)
    );
    console.log(userToken);
    console.log(this.currentUser);
    
  }

}


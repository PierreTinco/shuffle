import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getStorage, ref, uploadBytes } from "firebase/storage";
@Injectable({
  providedIn: 'root'
})


export class ApiService {
 
  constructor(private http : HttpClient) { }

  getAllEvents(data : any){
    return this.http.post(`${environment.apiUrl}/event`,data)
  }

  addEvents(data :any){
    return this.http.post(`${environment.apiUrl}/event/insert`,data)
  }

  deleteEvents(data :any){
    return this.http.delete(`${environment.apiUrl}/event/delete`,data)
  }
  getUserEvent(data :any){
    return this.http.post(`${environment.apiUrl}/user_event`,data)

  }
  addUserEvent(data: any){
    return this.http.post(`${environment.apiUrl}/user_event/insert`,data)
  }

  addUser(data: any) {
    return this.http.post(`${environment.apiUrl}/user/insert`,data)
  }


  getUser(data : any) {
    console.log("data",data)
    return this.http.post(`${environment.apiUrl}/user`,data)
  }

  getFriends(data : any){
    return this.http.post(`${environment.apiUrl}/friends`,data)
  }
  // getPhoto() {
  //   return this.http.get<ApiImage[]>('${this.url}/image')
  // }

  
 

}




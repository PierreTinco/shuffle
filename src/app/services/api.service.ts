import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

getAllEvents(){
  return this.http.post<any>("http://localhost:3000/shuffle/event",{})
}

addEvents(data :any){
  return this.http.post("http://localhost:3000/shuffle/event/insert",data)
}

deleteEvents(data :any){
  return this.http.delete("http://localhost:3000/shuffle/event/delete",data)
}

}

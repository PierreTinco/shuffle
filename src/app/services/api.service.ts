import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

getAllEvents(){
  const body = 
  {
    "where" : {
        "id": 26
    }
}
  ;
  return this.http.post(`${environment.apiUrl}/event`,{responseType: 'text'})
  // return this.http.get<any>("https://restcountries.com/v2/all",{})

}

addEvents(data :any){
  return this.http.post(`${environment.apiUrl}/insert`,data)
}

deleteEvents(data :any){
  return this.http.delete(`${environment.apiUrl}/delete`,data)
}

}

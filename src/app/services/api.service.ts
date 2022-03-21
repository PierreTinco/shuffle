import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

getAllEvents(){
  return this.http.post(`${environment.apiUrl}/event`,{responseType: 'text'})
}

addEvents(data :any){
  return this.http.post(`${environment.apiUrl}/event/insert`,data)
}

deleteEvents(data :any){
  return this.http.delete(`${environment.apiUrl}/event/delete`,data)
}

addUser(data: any) {
  return this.http.post(`${environment.apiUrl}/user/insert`,data)
}

// getImages() {
//   return this.http.get<ApiImage[]>('${this.url}/image')
// }

}

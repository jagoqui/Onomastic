import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class EventDayService {

  constructor(private http: HttpClient) { }

  // TODO: Todos éstos servicios estan en EmailUsersService en shared

  getSchools() {
    return this.http.get<any>(`${environment.API_URL}/asociaciones`);
  }

  getAsociations() {
    return this.http.get<any>(`${environment.API_URL}/vinculaciones`);
  }

  getPrograms() {
    return this.http.get<any>(`${environment.API_URL}/programasacademicos`);
  }

}

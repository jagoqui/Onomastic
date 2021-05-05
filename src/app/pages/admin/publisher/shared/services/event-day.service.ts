import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Condition, EventDay } from '@adminShared/models/event-day.model';

@Injectable({
  providedIn: 'root'
})
export class EventDayService {

  constructor(
    private http: HttpClient
  ) {
  }

  save(event: EventDay): Observable<EventDay> {
    if(event?.id){
      console.log(event.id);
      return this.http
        .put<EventDay>(`${environment.apiUrl}/evento/${event.id}`, event);
    }
    return this.http
      .post<EventDay>(`${environment.apiUrl}/evento`, event);
  }

  getEvents(): Observable<EventDay[]> {
    return this.http.get<EventDay[]>(`${environment.apiUrl}/eventos`);
  }

  getConditions(): Observable<Condition[]> {
    return this.http
      .get<Condition[]>(`${environment.apiUrl}/evento/condiciones`);
  }


  getAssociatedEvents(idTemplate: number): Observable<EventDay[]> {
    return this.http
      .get<EventDay[]>(`${environment.apiUrl}/evento/plantilla/${idTemplate}`);
  };

  delete(id: number): Observable<[]> {
    return this.http
      .delete<[]>(`${environment.apiUrl}/evento/${id}`);
  }

  inactivateEvent(id: number): Observable<EventDay> {
    return this.http
      .put<EventDay>(`${environment.apiUrl}/evento/desactivar/${id}`, null);
  }

  activateEvent(id: number): Observable<EventDay> {
    return this.http
      .put<EventDay>(`${environment.apiUrl}/evento/activar/${id}`, null);
  }
}

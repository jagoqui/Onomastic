import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ConditionRes, EventDay } from '@adminShared/models/event-day.model';

@Injectable({
  providedIn: 'root'
})
export class EventDayService {

  constructor(
    private http: HttpClient
  ) {
  }

  new(event: EventDay): Observable<EventDay> {
    return this.http
      .post<EventDay>(`${environment.apiUrl}/evento`, event);
  }

  getConditions(): Observable<ConditionRes[]> {
    return this.http
      .get<ConditionRes[]>(`${environment.apiUrl}/evento/condiciones`);
  }

  getEvents(): Observable<EventDay[]> {
    return this.http.get<EventDay[]>(`${environment.apiUrl}/`);
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

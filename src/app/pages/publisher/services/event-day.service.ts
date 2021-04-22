import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConditionRes, EventDay } from '@app/shared/models/event-day.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

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

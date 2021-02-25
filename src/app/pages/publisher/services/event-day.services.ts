import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CondicionesEvento } from '@app/shared/models/event-day.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventDayService {

  constructor(private http: HttpClient) { }

  getConditions(): Observable<CondicionesEvento[]> {
    return this.http
      .get<CondicionesEvento[]>(`${environment.API_URL}/condicion`);
  }

}

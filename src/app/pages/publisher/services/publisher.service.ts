import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private http: HttpClient) { }

  // getConditions(): Observable<CondicionesEvento[]> {
  //   return this.http
  //     .get<CondicionesEvento[]>(`${environment.API_URL}/condicion`);
  // }
}

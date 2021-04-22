import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { MailUsers } from '@adminShared/models/mail-users.model';
import { Publisher } from '@adminShared/models/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private http: HttpClient) {
  }

  new(user: MailUsers): Observable<Publisher> {
    return this.http
      .post<Publisher>(`${environment.apiUrl}/usuarios`, user);
  }

  getAll(): Observable<Publisher[]> {
    return this.http
      .get<Publisher[]>(`${environment.apiUrl}/usuarios`);
  }

  delete(id: number): Observable<[]> {
    return this.http
      .delete<[]>(`${environment.apiUrl}/usuarios/${id}`);
  }

  deactivate(id: number): Observable<Publisher> {
    return this.http
      .put<Publisher>(`${environment.apiUrl}/usuarios/deactivate/${id}`, null);
  }

  activate(id: number): Observable<MailUsers> {
    return this.http
      .put<MailUsers>(`${environment.apiUrl}/usuarios/activate/${id}`, null);
  }

}
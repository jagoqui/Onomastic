import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Recipient } from '@adminShared/models/recipient.model';
import { ID } from '@adminShared/models/shared.model';

@Injectable({ providedIn: 'root' })
export class RecipientService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAll(): Observable<Recipient[]> {
    return this.http
      .get<Recipient[]>(`${environment.apiUrl}/usuariosemail`);
  }

  save(user: Recipient, id?: ID): Observable<Recipient> {
    if (id) {
      return this.http
        .put<Recipient>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`, user);
    }
    return this.http
      .post<Recipient>(`${environment.apiUrl}/usuariosemail`, user);
  }

  getById(id: ID): Observable<Recipient> {
    return this.http
      .get<Recipient>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }

  delete(id: ID): Observable<[]> {
    return this.http
      .delete<[]>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }

  unsubscribe(emailEncrypt: string): Observable<Recipient> {
    return this.http
      .put<Recipient>(`${environment.apiUrl}/unsubscribe/${emailEncrypt}`, null);
  }

  subscribe(email: string): Observable<Recipient> {
    return this.http
      .put<Recipient>(`${environment.apiUrl}/usuariosemail/subscribe/${email}`, null);
  }

}

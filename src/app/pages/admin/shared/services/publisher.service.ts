import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Recipient} from '@adminShared/models/recipient.model';
import {Publisher} from '@adminShared/models/publisher.model';
import {STATE} from "@adminShared/models/shared.model";

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private http: HttpClient) {
  }

  save(publisher: Publisher): Observable<Publisher> {
    if (publisher?.id) {
      return this.http
        .put<Publisher>(`${environment.apiUrl}/usuarios/${publisher.id}`, publisher);
    }
    return this.http
      .post<Publisher>(`${environment.apiUrl}/usuarios`, publisher);
  }

  getPublisher(id: string): Observable<Publisher> {
    return this.http
      .get<Publisher>(`${environment.apiUrl}/usuarios/${id}`);
  }

  getPublisherState(id: string): Observable<STATE> {
    return this.http
      .get<STATE>(`${environment.apiUrl}/usuarios/${id}`);
  }


  getAll(): Observable<Publisher[]> {
    return this.http
      .get<Publisher[]>(`${environment.apiUrl}/usuarios`);
  }

  delete(id: number): Observable<[]> {
    return this.http
      .delete<[]>(`${environment.apiUrl}/usuarios/${id}`);
  }

  activate(email: string): Observable<Recipient> {
    return this.http
      .put<Recipient>(`${environment.apiUrl}/usuarios/activar/${email}`, null);
  }

  deactivate(email: string): Observable<Publisher> {
    return this.http
      .put<Publisher>(`${environment.apiUrl}/usuarios/desactivar/${email}`, null);
  }

}

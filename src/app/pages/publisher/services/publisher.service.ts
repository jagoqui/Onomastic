import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {ByNameId, ID, MailUsers, ProgramaAcademicoPorUsuarioCorreo} from '@shared/models/mail-users.model';
import { AuthService } from '@auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor( private http: HttpClient,
               private authSvc: AuthService) {
  }

  getAssociations(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/asociaciones`);
  }


  new(user: MailUsers): Observable<MailUsers> {
    return this.http
      .post<MailUsers>(`${environment.apiUrl}/`, user);
  }

  getPublishers(): Observable<MailUsers[]> {
    return this.http
      .get<MailUsers[]>(`${environment.apiUrl}/`);
  }

  delete(id: number): Observable<[]> {
    return this.http
      .delete<[]>(`${environment.apiUrl}//${id}/${this.authSvc.getUserId()}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ByNameId, ID, MailUsers, ProgramaAcademicoPorUsuarioCorreo } from '@shared/models/mail-users.model';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmailUserService {

  constructor(
    private http: HttpClient,
    private authSvc: AuthService
  ) {
  }

  getAll(): Observable<MailUsers[]> {
    return this.http
      .get<MailUsers[]>(`${environment.apiUrl}/usuariosemail`);
  }

  saveMailUser(user: MailUsers, id?: ID): Observable<MailUsers> {
    if (id) {
      return this.http
        .put<MailUsers>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`, user);
    }
    return this.http
      .post<MailUsers>(`${environment.apiUrl}/usuariosemail`, user);
  }

  getById(id: ID): Observable<MailUsers> {
    return this.http
      .get<MailUsers>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }

  delete(id: ID): Observable<[]> {
    return this.http
      .delete<[]>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }

  unsubscribe(emailEncrypt: string): Observable<MailUsers> {
    return this.http
      .put<MailUsers>(`${environment.apiUrl}/unsubscribe/${emailEncrypt}`, null);
  }

  subscribe(email: string): Observable<MailUsers> {
    return this.http
      .put<MailUsers>(`${environment.apiUrl}/usuariosemail/subscribe/${email}`, null);
  }

}

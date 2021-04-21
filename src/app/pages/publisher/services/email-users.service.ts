import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ByNameId, ID, MailUsers, ProgramaAcademicoPorUsuarioCorreo } from '@shared/models/mail-users.model';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmailUsersService {

  constructor(
    private http: HttpClient,
    private authSvc: AuthService
  ) {
  }

  getAll(): Observable<MailUsers[]> {
    return this.http
      .get<MailUsers[]>(`${environment.apiUrl}/usuariosemail`);
  }

  getAssociations(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/asociaciones`);
  }

  getAssociationsById(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/usuarios/asociacion/${this.authSvc.getUserId()}`);
  }

  getAcademicPrograms(): Observable<ProgramaAcademicoPorUsuarioCorreo[]> {
    return this.http
      .get<ProgramaAcademicoPorUsuarioCorreo[]>(`${environment.apiUrl}/programasacademicos`);
  }

  getAcademicProgramByCode(code: number): Observable<ProgramaAcademicoPorUsuarioCorreo> {
    return this.http
      .get<ProgramaAcademicoPorUsuarioCorreo>(`${environment.apiUrl}/programasacademicos/${code}`);
  }

  getBondingTypes(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/vinculaciones`);
  }

  getBondingTypeById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.apiUrl}/vinculaciones/${id}`);
  }

  getPlatforms(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/plataformas`);
  }

  getPlatformById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.apiUrl}/plataformas/${id}`);
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
      .put<MailUsers>(`${environment.apiUrl}/unsuscribe/${emailEncrypt}`, null);
  }

  subscribe(email: string): Observable<MailUsers> {
    return this.http
      .put<MailUsers>(`${environment.apiUrl}/usuariosemail/suscribe/${email}`, null);
  }

}

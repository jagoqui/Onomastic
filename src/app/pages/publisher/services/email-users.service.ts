import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ByNameId,
  ID,
  MailUsers,
  MailUsersResponse,
  ProgramaAcademicoPorUsuarioCorreo,
} from 'src/app/shared/models/mail-users.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailUsersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<MailUsersResponse[]> {
    return this.http
      .get<MailUsersResponse[]>(`${environment.API_URL}/usuariosemail`);
  }

  getAssociations(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.API_URL}/asociaciones`);
  }

  getAcademicPrograms(): Observable<ProgramaAcademicoPorUsuarioCorreo[]> {
    return this.http
      .get<ProgramaAcademicoPorUsuarioCorreo[]>(`${environment.API_URL}/programasacademicos`);
  }

  getBondingTypes(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.API_URL}/vinculaciones`);
  }

  getPlatforms(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.API_URL}/plataformas`);
  }


  new(user: MailUsers): Observable<MailUsersResponse> {
    return this.http
      .put<MailUsers>(`${environment.API_URL}/usuariosemail`, user);
  }

  getById(id: ID): Observable<MailUsersResponse> {
    return this.http
      .get<MailUsersResponse>(`${environment.API_URL}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }


  update(id: ID, user: MailUsers): Observable<MailUsersResponse> {
    return this.http
      .post<MailUsersResponse>(`${environment.API_URL}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`, user);
  }

  delete(id: ID): Observable<{}> {
    return this.http
      .delete<MailUsers>(`${environment.API_URL}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }

}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {ByNameId, ID, MailUsers, MailUsersResponse, ProgramaAcademicoPorUsuarioCorreo} from '@shared/models/mail-users.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class EmailUsersService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<MailUsersResponse[]> {
    return this.http
      .get<MailUsersResponse[]>(`${environment.apiUrl}/usuariosemail`);
  }

  getAssociations(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/asociaciones`);
  }

  getAssociationById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.apiUrl}/asociaciones/${id}`);
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

  new(user: MailUsers): Observable<MailUsersResponse> {
    return this.http
      .post<MailUsers>(`${environment.apiUrl}/usuariosemail`, user);
  }

  getById(id: ID): Observable<MailUsersResponse> {
    return this.http
      .get<MailUsersResponse>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }


  update(id: ID, user: MailUsers): Observable<MailUsersResponse> {
    return this.http
      .put<MailUsersResponse>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`, user);
  }

  delete(id: ID): Observable<MailUsers> {
    return this.http
      .delete<MailUsers>(`${environment.apiUrl}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }

  unsubscribe(email: string): Observable<MailUsersResponse> {
    return this.http
      .put<MailUsersResponse>(`${environment.apiUrl}/usuariosemail/${email}`,null);
  }

}

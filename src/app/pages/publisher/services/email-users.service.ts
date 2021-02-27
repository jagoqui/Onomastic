import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {ByNameId, ID, MailUsers, MailUsersResponse, ProgramaAcademicoPorUsuarioCorreo,} from '@shared/models/mail-users.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class EmailUsersService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<MailUsersResponse[]> {
    return this.http
      .get<MailUsersResponse[]>(`${environment.API_URL}/usuariosemail`);
  }

  getAssociations(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.API_URL}/asociaciones`);
  }

  getAssociationById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.API_URL}/asociaciones/${id}`);
  }

  getAcademicPrograms(): Observable<ProgramaAcademicoPorUsuarioCorreo[]> {
    return this.http
      .get<ProgramaAcademicoPorUsuarioCorreo[]>(`${environment.API_URL}/programasacademicos`);
  }

  getAcademicProgramByCode(code: number): Observable<ProgramaAcademicoPorUsuarioCorreo> {
    return this.http
      .get<ProgramaAcademicoPorUsuarioCorreo>(`${environment.API_URL}/programasacademicos/${code}`);
  }

  getBondingTypes(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.API_URL}/vinculaciones`);
  }

  getBondingTypeById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.API_URL}/vinculaciones/${id}`);
  }

  getPlatforms(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.API_URL}/plataformas`);
  }

  getPlatformById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.API_URL}/plataformas/${id}`);
  }

  new(user: MailUsers): Observable<MailUsersResponse> {
    return this.http
      .post<MailUsers>(`${environment.API_URL}/usuariosemail`, user);
  }

  getById(id: ID): Observable<MailUsersResponse> {
    return this.http
      .get<MailUsersResponse>(`${environment.API_URL}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }


  update(id: ID, user: MailUsers): Observable<MailUsersResponse> {
    return this.http
      .put<MailUsersResponse>(`${environment.API_URL}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`, user);
  }

  delete(id: ID): Observable<{}> {
    return this.http
      .delete<MailUsers>(`${environment.API_URL}/usuariosemail/${id.tipoIdentificacion}/${id.numeroIdentificacion}`);
  }

}

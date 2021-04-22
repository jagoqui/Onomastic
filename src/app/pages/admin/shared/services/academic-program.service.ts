import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ProgramaAcademicoPorUsuarioCorreo } from '@adminShared/models/mail-users.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicProgramService {

  constructor(private http: HttpClient) { }

  getAcademicPrograms(): Observable<ProgramaAcademicoPorUsuarioCorreo[]> {
    return this.http
      .get<ProgramaAcademicoPorUsuarioCorreo[]>(`${environment.apiUrl}/programasacademicos`);
  }

  getAcademicProgramByCode(code: number): Observable<ProgramaAcademicoPorUsuarioCorreo> {
    return this.http
      .get<ProgramaAcademicoPorUsuarioCorreo>(`${environment.apiUrl}/programasacademicos/${code}`);
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramaAcademicoPorUsuarioCorreo } from '@shared/models/mail-users.model';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

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

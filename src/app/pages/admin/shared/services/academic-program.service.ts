import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ByIdOrCode } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicProgramService {

  constructor(private http: HttpClient) { }

  getAcademicPrograms(): Observable<ByIdOrCode[]> {
    return this.http
      .get<ByIdOrCode[]>(`${environment.apiUrl}/programasacademicos`);
  }

  getAcademicProgramByCode(code: number): Observable<ByIdOrCode> {
    return this.http
      .get<ByIdOrCode>(`${environment.apiUrl}/programasacademicos/${code}`);
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ByNameId } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicProgramService {

  constructor(private http: HttpClient) { }

  getAcademicPrograms(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/programasacademicos`);
  }

  getAcademicProgramByCode(code: number): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.apiUrl}/programasacademicos/${code}`);
  }

}

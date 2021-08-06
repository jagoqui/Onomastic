import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {Program} from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicProgramService {

  constructor(private http: HttpClient) {
  }

  getAcademicPrograms(): Observable<Program[]> {
    return this.http
      .get<Program[]>(`${environment.apiUrl}/programasacademicos`);
  }
}

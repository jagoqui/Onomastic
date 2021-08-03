import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {ByIdOrCode} from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(private http: HttpClient) {
  }

  getAdministrativeUnits(): Observable<ByIdOrCode[]> {
    return this.http
      .get<ByIdOrCode[]>(`${environment.apiUrl}/unidadAdministrativa`);
  }

  getAcademicUnits(): Observable<ByIdOrCode[]> {
    return this.http
      .get<ByIdOrCode[]>(`${environment.apiUrl}/unidadAcademica`);
  }

  getAssociationsByPublisher(): Observable<ByIdOrCode[]> { /*TODO: Éste método puede sobrar*/
    return this.http
      .get<ByIdOrCode[]>(`${environment.apiUrl}/usuarios/asociacion`);
  }
}

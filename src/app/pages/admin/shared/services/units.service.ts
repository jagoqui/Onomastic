import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {ByIdAndName} from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(private http: HttpClient) {
  }

  getAdministrativeUnits(): Observable<ByIdAndName[]> {
    return this.http
      .get<ByIdAndName[]>(`${environment.apiUrl}/unidadesadministrativas`);
  }

  getAcademicUnits(): Observable<ByIdAndName[]> {
    return this.http
      .get<ByIdAndName[]>(`${environment.apiUrl}/unidadesacademicas`);
  }

  getAssociationsByPublisher(): Observable<ByIdAndName[]> { /*TODO: Éste método puede sobrar*/
    return this.http
      .get<ByIdAndName[]>(`${environment.apiUrl}/usuarios/asociacion`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ByNameId } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  constructor(private http: HttpClient) { }

  getAssociations(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/asociaciones`);
  }

  getAssociationsByPublisher(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/usuarios/asociacion`);
  }
}

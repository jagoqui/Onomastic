import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ByNameId } from '@shared/models/mail-users.model';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  constructor(private http: HttpClient) { }

  getAssociations(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/asociaciones`);
  }

  getAssociationsByUser(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/usuarios/asociacion`);
  }
}

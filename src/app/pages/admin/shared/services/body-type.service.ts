import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ByNameId } from '@adminShared/models/mail-users.model';

@Injectable({
  providedIn: 'root'
})
export class BodyTypeService {

  constructor(private http: HttpClient) { }

  getBondingTypes(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/vinculaciones`);
  }

  getBondingTypeById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.apiUrl}/vinculaciones/${id}`);
  }
}

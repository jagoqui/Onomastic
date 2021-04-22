import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ByNameId } from '@shared/models/mail-users.model';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

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

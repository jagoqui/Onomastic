import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ByIdOrCode } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class BodyTypeService {

  constructor(private http: HttpClient) { }

  getBondingTypes(): Observable<ByIdOrCode[]> {
    return this.http
      .get<ByIdOrCode[]>(`${environment.apiUrl}/vinculaciones`);
  }

  getBondingTypeById(id: string): Observable<ByIdOrCode> {
    return this.http
      .get<ByIdOrCode>(`${environment.apiUrl}/vinculaciones/${id}`);
  }
}

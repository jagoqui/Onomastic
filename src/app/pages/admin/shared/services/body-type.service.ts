import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ByIdAndName } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class BodyTypeService {

  constructor(private http: HttpClient) { }

  getBondingTypes(): Observable<ByIdAndName[]> {
    return this.http
      .get<ByIdAndName[]>(`${environment.apiUrl}/vinculaciones`);
  }

  getBondingTypeById(id: string): Observable<ByIdAndName> {
    return this.http
      .get<ByIdAndName>(`${environment.apiUrl}/vinculaciones/${id}`);
  }
}

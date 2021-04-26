import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ByIdOrCode } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private http: HttpClient) {
  }

  getPlatforms(): Observable<ByIdOrCode[]> {
    return this.http
      .get<ByIdOrCode[]>(`${environment.apiUrl}/plataformas`);
  }

  getPlatformById(id: string): Observable<ByIdOrCode> {
    return this.http
      .get<ByIdOrCode>(`${environment.apiUrl}/plataformas/${id}`);
  }
}

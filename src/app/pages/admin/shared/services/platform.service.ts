import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ByIdAndName } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private http: HttpClient) {
  }

  getPlatforms(): Observable<ByIdAndName[]> {
    return this.http
      .get<ByIdAndName[]>(`${environment.apiUrl}/plataformas`);
  }

  getPlatformById(id: string): Observable<ByIdAndName> {
    return this.http
      .get<ByIdAndName>(`${environment.apiUrl}/plataformas/${id}`);
  }
}

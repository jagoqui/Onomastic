import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ByNameId } from '@shared/models/mail-users.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private http: HttpClient) {
  }

  getPlatforms(): Observable<ByNameId[]> {
    return this.http
      .get<ByNameId[]>(`${environment.apiUrl}/plataformas`);
  }

  getPlatformById(id: string): Observable<ByNameId> {
    return this.http
      .get<ByNameId>(`${environment.apiUrl}/plataformas/${id}`);
  }
}

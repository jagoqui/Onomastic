import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { RecipientsLog } from '@adminShared/models/recipients-log.model';

@Injectable({
  providedIn: 'root'
})
export class RecipientsLogService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<RecipientsLog[]> {
    return this.http
      .get<RecipientsLog[]>(`${environment.apiUrl}/emails`);
  }
}

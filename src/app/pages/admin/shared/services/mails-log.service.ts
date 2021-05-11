import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { MailsLog } from '@app/pages/admin/shared/models/mails-log.model';

@Injectable({
  providedIn: 'root'
})
export class MailsLogService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<MailsLog[]> {
    return this.http
      .get<MailsLog[]>(`${environment.apiUrl}/emails`);
  }
}

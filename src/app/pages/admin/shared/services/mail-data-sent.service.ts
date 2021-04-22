import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { MailDataSent } from '@adminShared/models/mail-data-sent.model';

@Injectable({
  providedIn: 'root'
})
export class MailDataSentService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<MailDataSent[]> {
    return this.http
      .get<MailDataSent[]>(`${environment.apiUrl}/emails`);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {RecipientsLog} from '@adminShared/models/recipients-log.model';

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
  getLoveStatus(userEmail: string, eventId: string): Observable<boolean> {
    const params = new HttpParams(
      {
        fromObject: {
          userEmail: userEmail as unknown as string,
          eventId: eventId as unknown as string
        }
      }
    );
    return this.http
      .get<boolean>(`${environment.apiUrl}/recipients_log/love_status`, {params});
  }

  setLoveStatus(isLove: boolean, userEmail: string, eventId: string): Observable<RecipientsLog> {
    const params = new HttpParams(
      {
        fromObject: {
          isLove: isLove as unknown as string,
          userEmail: userEmail as unknown as string,
          eventId: eventId as unknown as string
        }
      }
    );
    return this.http
      .get<RecipientsLog>(`${environment.apiUrl}/recipients_log/set_love`, {params});
  }

}

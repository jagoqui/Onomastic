import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  MailUserResponse,
  MailUsers,
} from 'src/app/shared/models/mail-users.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailUsersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<MailUserResponse[]> {
    return this.http
      .get<MailUserResponse[]>(`${environment.API_URL}`)
      .pipe(catchError(this.handlerError));
  }

  getById(userId: number): Observable<MailUsers> {
    return this.http
      .get<any>(`${environment.API_URL}/users/${userId}`)
      .pipe(catchError(this.handlerError));
  }

  new(user: MailUsers): Observable<MailUsers> {
    return this.http
      .post<MailUsers>(`${environment.API_URL}/users`, user)
      .pipe(catchError(this.handlerError));
  }

  update(userId: number, user: MailUsers): Observable<MailUsers> {
    return this.http
      .patch<MailUsers>(`${environment.API_URL}/users/${userId}`, user)
      .pipe(catchError(this.handlerError));
  }

  delete(userId: number): Observable<{}> {
    return this.http
      .delete<MailUsers>(`${environment.API_URL}/users/${userId}`)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error): Observable<never> {
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MailUse1rsInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'token-mail-user': ''
    });

    const requestClone = req.clone({
      headers
    });

    return next.handle(requestClone).pipe(
      catchError(this.handlerError)
    );
  }

  handlerError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `Error! ${error.message}`;
    }
    console.warn(errorMessage);
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

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
import { catchError, finalize } from 'rxjs/operators';

import { LoaderService } from '../services/loader.service';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor(private loaderSvc: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderSvc.setLaoding(true);
    const headers = new HttpHeaders({
      'token-mail-user': ''
    });

    const requestClone = req.clone({
      headers
    });

    return next.handle(requestClone).pipe(
      catchError(this.handlerError),
      finalize(
        () => {
          this.loaderSvc.setLaoding(false);
        }
      )
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

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

import { LoaderService } from '../services/loader.service';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor(
    private loaderSvc: LoaderService,
    private authSvc: AuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderSvc.setLoading(true);

    const requestClone = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${this.authSvc.getUserToken()}`
      )
    });
    return next.handle(requestClone).pipe(
        catchError(this.handlerError),
        finalize(
          () => {
            this.loaderSvc.setLoading(false);
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
    SwAlert.fire({
      icon: 'error',
      html: '',
      title: 'Oops...',
      text: ' Algo salió mal en la petición!',
      footer: `${errorMessage}`
    }).then(r => console.log(r));
    return throwError(errorMessage);
  }
}

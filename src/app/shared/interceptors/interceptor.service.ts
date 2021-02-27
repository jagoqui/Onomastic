import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

import { LoaderService } from '../services/loader.service';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor(private loaderSvc: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderSvc.setLoading(true);
    // const headers = new HttpHeaders({
    //   'token-mail-user': ''
    // });

    // const requestClone = req.clone({
    //   headers
    // });
    const requestClone = req.clone();

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

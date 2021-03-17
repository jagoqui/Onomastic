import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

import { LoaderService } from '../services/loader.service';
import { AuthService } from '@auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor(
    private loaderSvc: LoaderService,
    public  authSvc: AuthService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderSvc.setLoading(true);

    const requestClone = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${this.authSvc.getUserToken()}`
      )
    });
    return next.handle(requestClone).pipe(
      tap(
        () => {
        },
        err => {
          SwAlert.fire({
            icon: 'error',
            html: '',
            title: 'Oops...',
            text: ` Algo salió mal en la petición!. ${err.status === 401 ? 'Por seguridad se cerrará la sesión' : ''}`,
            footer: `<span style='color: red'>Error! <b>${err.error.error}.</b></span>`
          }).then(r => {
            if (err.status === 401) {
              this.authSvc.logout();
              this.loaderSvc.setLoading(false);
            }
          });
        },
        () => {
          this.loaderSvc.setLoading(false);
        }
      )
    );
  }
}

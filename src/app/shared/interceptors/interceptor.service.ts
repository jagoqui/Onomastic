import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

import { LoaderService } from '../services/loader.service';
import { AuthService } from '@pages/admin/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor(
    private loaderSvc: LoaderService,
    public  authSvc: AuthService,
    private router: Router,
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
          // TODO: Crear objeto con mensajes de error
          SwAlert.fire({
            icon: 'error',
            html: '',
            title: 'Oops...',
            text: ` Algo salió mal en la petición!. ${err.status === 401 ? 'Por seguridad se cerrará la sesión' : ''}`,
            footer: `
                <span style="color: red;">
                    Error ${err.status}! <b> ${err.error?.error=== 'Forbidden'? 'Necesita permisos de admin.' : err.error?.error}</b></span>
                <span style="display: block;">&nbsp;&nbsp;Necesitas <a href="">ayuda</a>?</span>.`
          }).then(_ => {
            this.loaderSvc.setLoading(false);
            if (err.status === 401) {
              this.authSvc.logout();
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

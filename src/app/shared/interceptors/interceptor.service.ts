import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

import { LoaderService } from '../services/loader.service';
import { AuthService } from '@adminShared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor(
    private loaderSvc: LoaderService,
    public authSvc: AuthService
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
            title: ` Algo salió mal en la petición.`,
            footer: `
                <span style='color: red;'>
                    Error ${err.status}! <b> ${err.status === 403 ? 'Necesita permisos de admin.' : err.error?.error}</b>
                    ${err.status === 401 ? 'La sesión ha cauducado, por favor vuelva a loguearse.' : ''}
                </span>
                <span>&nbsp;&nbsp;Necesitas <a href=''>ayuda</a>?</span>.`
          }).then(_ => {
            this.loaderSvc.setLoading(false);
            console.warn(this.getServerErrorMessage(err));
          });
        },
        () => {
          this.loaderSvc.setLoading(false);
        }
      )
    );
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 401: {
        this.authSvc.logout();
        return `Forbidden: ${error.message}`;
      }
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }
    }
  }
}

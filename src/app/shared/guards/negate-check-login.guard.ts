import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@adminShared/services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NegateCheckLoginGuard implements CanActivate {
  constructor(private authSvc: AuthService) {
  }

  canActivate(): Observable<boolean> {
    return this.authSvc.isLogged$.pipe(
      take(1),
      map((logged: boolean) => {
          if (!logged) {
            alert('Acceso denegado!');
          }
          return !logged;
        }
      )
    );
  }
}

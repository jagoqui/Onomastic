import {Injectable} from '@angular/core';
import { CanActivate, NavigationEnd, Route, Router } from '@angular/router';
import {AuthService} from '@adminShared/services/auth.service';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {Auth} from '@adminShared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {
  constructor(
    private authSvc: AuthService,
    private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.authSvc.userResponse$.pipe(
      take(1),
      map((userRes: Auth) => {
        if (userRes) {
          return true;
        }
        alert('Acceco denegado!');
        this.router.navigate(['/login']).then(r => console.log(r));
        return false;
      })
    );
  }

}

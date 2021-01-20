import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { PlatformUserResponse } from '../models/platform-users.model';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {
  constructor(private authSvc: AuthService, private route: Router) { }

  canActivate(): Observable<boolean> {
    return this.authSvc.userResponse$.pipe(
      take(1),
      map((userRes: PlatformUserResponse) => {
        if (userRes) {
          return true;
        }
        alert('Acceco denegado!');
        this.route.navigate(['/login']);
        return false;
      })
    );
  }

}

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

import { PlatformUserResponse } from '../models/platform-users.model';

@Injectable({
  providedIn: 'root'
})
export class NegateCheckLoginGuard implements CanActivate {
  constructor(private authSvc: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.authSvc.userResponse$.pipe(
      take(1),
      map((userRes: PlatformUserResponse) => (!userRes ? true : false))
    );
  }


}

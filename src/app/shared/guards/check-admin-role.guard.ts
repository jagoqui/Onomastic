import {Injectable} from '@angular/core';
import {CanActivate,} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '@adminShared/services/auth.service';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckAdminRoleGuard implements CanActivate {
  constructor(
    private authSvc: AuthService,) {
  }

  canActivate(): Observable<boolean> {
    return this.authSvc.isAdmin$.pipe(
      take(1),
      map((isAdmin: boolean) => isAdmin));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PlatformUser, PlatformUserResponse } from '@pages/admin/shared/models/platform-users.model';
import { environment } from '@env/environment';
import { ThemeSwitcherControllerService } from '@appShared/services/theme-switcher-controller.service';

const jwtHelper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformUserRes = new BehaviorSubject<PlatformUserResponse>(null);
  private isLogged = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private themeSwitcherController: ThemeSwitcherControllerService) {
    this.checkToken();
  }

  get userResponse$(): Observable<PlatformUserResponse> {
    return this.platformUserRes.asObservable();
  }

  get userResponseValue(): PlatformUserResponse {
    return this.platformUserRes.getValue();
  }

  get isLogged$(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  get isLoggedValue(): boolean {
    return this.isLogged.getValue();
  }

  getUserToken(): string {
    let token: string = null;
    this.userResponse$.subscribe((userRes: PlatformUserResponse) => {
      if (userRes) {
        token = userRes.token;
      }
    });
    return token;
  }

  getUserId(): number {
    let id: number = null;
    this.userResponse$.subscribe((userRes: PlatformUserResponse) => {
      if (userRes) {
        id = userRes.id;
      }
    });
    return id;
  }

  login(authData: PlatformUser): Observable<PlatformUserResponse | void> {
    return this.http.post<PlatformUserResponse>(`${environment.apiUrl}/auth/signin`, authData).pipe(
      map((userResponse: any) => {
        const decode = jwtHelper.decodeToken(userResponse.accessToken);
        const userRes: PlatformUserResponse = {
          id: decode.sub,
          name: decode.nombre,
          userEmail: authData.userEmail,
          role: decode.rol,
          token: userResponse.accessToken
        };
        localStorage.setItem('PlatformUser', JSON.stringify(userRes));
        this.platformUserRes.next(userRes);
        this.isLogged.next(true);
        return userRes;
      })
    );
  }

  register(userData: PlatformUser): Observable<PlatformUserResponse | void> {
    return this.http.post<PlatformUserResponse>(`${environment.apiUrl}/usuarios`, userData).pipe(
      map((user: PlatformUserResponse) =>
        // this.saveLocalStorage(user);
        user
      )
    );
  }

  logout() {
    this.platformUserRes.next(null);
    this.isLogged.next(false);
    this.router.navigate(['/login']).then();
    this.themeSwitcherController.setThemeClass('light-theme');
    localStorage.clear();
  }

  private checkToken() {
    const platformUser = JSON.parse(localStorage.getItem('PlatformUser')) || null;
    if (platformUser) {
      const isExpired = jwtHelper.isTokenExpired(platformUser.token);
      if (isExpired) {
        this.logout();
      } else {
        this.platformUserRes.next(platformUser);
        this.isLogged.next(true);
      }
    } else {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: RouterEvent) => {
          const { url } = event;
          const routeSubscriptionStatus: boolean = url.indexOf('mail-users-subscription-status') === 1;
          if (!routeSubscriptionStatus) {
            this.router.navigate(['/login']).then(_ => console.log('Session redirect to login'));
            //TODO: No se cierran los modals si se cierra la sesion automaticamente
          }
        });
    }
  }
}
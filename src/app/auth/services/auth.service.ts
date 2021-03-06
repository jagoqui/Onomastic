import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlatformUser, PlatformUserResponse } from 'src/app/shared/models/platform-users.model';
import { environment } from 'src/environments/environment';
import { ThemeSwitcherControllerService } from '@shared/services/theme-switcher-controller.service';

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

  getUserId(): number {
    let id: number = null;
    this.userResponse$.subscribe((userRes: PlatformUserResponse) => {
      if (userRes) {
        id = userRes.id;
      }
    });
    return id;
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
    return this.http.post<PlatformUserResponse>(`${environment.apiUrl}/users`, userData).pipe(
      map((user: PlatformUserResponse) =>
        // this.saveLocalStorage(user);
        user
      )
    );
  }

  logout() {
    this.platformUserRes.next(null);
    this.isLogged.next(false);
    this.router.navigate(['/login']).then(r => console.log(r));
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
      this.router.navigate(['/login']).then(r => console.log(r));
    }
  }
}

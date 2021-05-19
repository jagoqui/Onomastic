import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthRes} from '@adminShared/models/auth.model';
import { environment } from '@env/environment';
import { ThemeSwitcherControllerService } from '@appShared/services/theme-switcher-controller.service';

const jwtHelper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformUserRes = new BehaviorSubject<AuthRes>(null);
  private isLogged = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private themeSwitcherController: ThemeSwitcherControllerService) {
    this.checkToken();
  }

  get userResponse$(): Observable<AuthRes> {
    return this.platformUserRes.asObservable();
  }

  get userResponseValue(): AuthRes {
    return this.platformUserRes.getValue();
  }

  get isLogged$(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  get isLoggedValue(): boolean {
    return this.isLogged.getValue();
  }

  get isPublisherAdmin(): boolean{
    let isAdmin = false;
    this.userResponse$.subscribe((userRes: AuthRes) => {
      if (userRes) {
        isAdmin = userRes.role ==='ADMIN';
      }
    });
    return isAdmin;
  }

  getUserToken(): string {
    let token: string = null;
    this.userResponse$.subscribe((userRes: AuthRes) => {
      if (userRes) {
        token = userRes.token;
      }
    });
    return token;
  }

  getUserId(): number {
    let id: number = null;
    this.userResponse$.subscribe((userRes: AuthRes) => {
      if (userRes) {
        id = userRes.id;
      }
    });
    return id;
  }

  login(authData: AuthRes): Observable<AuthRes | void> {
    return this.http.post<AuthRes>(`${environment.apiUrl}/auth/signin`, authData).pipe(
      map((userResponse: any) => {
        const decode = jwtHelper.decodeToken(userResponse.accessToken);
        const userRes: AuthRes = {
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

  sendMailResetPassword(email: string): Observable<any>{
    const params = new HttpParams({
      fromObject: {
        email,
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/auth/forgotpwd`,{params});
  };

  resetPassword(token: string, password: string){
    const params = new HttpParams({
      fromObject: {
        token,
        password
      }
    });
    return this.http.post<any>(`${environment.apiUrl}/auth/resetpwd`,null,{params});
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
      //TODO: Pregutar si el usuario está activo
      if (isExpired) {
        this.logout();
      } else {
        this.platformUserRes.next(platformUser);
        this.isLogged.next(true);
      }
    }
  }
}

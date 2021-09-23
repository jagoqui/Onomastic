import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Auth, AuthRes, DecodeToken} from '@adminShared/models/auth.model';
import {environment} from '@env/environment';
import SwAlert from 'sweetalert2';

const jwtHelper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authRes = new BehaviorSubject<AuthRes>(null);
  private isLogged = new BehaviorSubject<boolean>(false);
  private isAdmin = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.checkToken();
  }

  get authRes$(): Observable<AuthRes> {
    return this.authRes.asObservable();
  }

  get isLogged$(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  get isAdmin$(): Observable<boolean>{
    console.log(this.isPublisherAdmin);
    return this.isAdmin.asObservable();
  }

  get authResValue(): AuthRes {
    return this.authRes.getValue();
  }

  get publisherId(): string {
    const authRes: AuthRes = JSON.parse(localStorage.getItem('AuthRes')) || null;
    return jwtHelper.decodeToken(authRes?.accessToken)?.sub;
  }

  get isPublisherAdmin(): boolean {
    let isAdmin = false;
    this.authRes$.subscribe((authRes) => {
      if (authRes) {
        isAdmin = this.decodeToken(authRes.accessToken).rol === 'ADMIN';
      }
    });
    this.isAdmin.next(isAdmin);
    return isAdmin;
  }

  login(authData: Auth): Observable<boolean> {
    authData.userEmail = `${authData.userEmail}${authData.userEmail.indexOf('@') === -1 ? '@udea.edu.co' : ''}`.trim();
    const {userEmail, password} = authData;
    return this.http.post<AuthRes>(`${environment.apiUrl}/auth/signin`, {userEmail, password}).pipe(
      map((authRes) => {
        if (authRes) {
          localStorage.setItem('AuthRes', JSON.stringify(authRes));
          this.authRes.next(authRes);
          this.isLogged.next(true);
          return true;
        }
        this.isLogged.next(false);
        return false;
      })
    );
  }

  decodeToken(token: string): DecodeToken {
    return jwtHelper.decodeToken(token);
  }

  sendMailResetPassword(email: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        email,
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/auth/forgotpwd`, {params});
  };

  resetPassword(token: string, password: string) {
    const params = new HttpParams({
      fromObject: {
        token,
        password
      }
    });
    return this.http.post<any>(`${environment.apiUrl}/auth/resetpwd`, null, {params});
  }

  logout() {
    this.authRes.next(null);
    this.isLogged.next(false);
    this.router.navigate(['/login']).then();
    localStorage.clear();
  }

  private checkToken() {
    const authRes: AuthRes = JSON.parse(localStorage.getItem('AuthRes')) || null;
    if (authRes) {
      const isExpired: boolean = jwtHelper.isTokenExpired(authRes.accessToken);
      if (isExpired) {
        //TODO: Posiblemente no se muestre la alerta, probar luego insertandolo dentro de un popup
        SwAlert.showValidationMessage('Expiró el tiempo de la sesión.');
        this.logout();
      } else {
        this.authRes.next(authRes);
        this.isLogged.next(true);
      }
    }
  }
}

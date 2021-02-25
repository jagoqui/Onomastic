import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PlatformUser,
  PlatformUserResponse,
} from 'src/app/shared/models/platform-users.model';
import { environment } from 'src/environments/environment';

const jwtHelper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private PlatformUserRes = new BehaviorSubject<PlatformUserResponse>(null);
  private isLogged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  get userResponse$(): Observable<PlatformUserResponse> {
    return this.PlatformUserRes.asObservable();
  }

  get userResponseValue(): PlatformUserResponse {
    return this.PlatformUserRes.getValue();
  }

  get isLoggged$(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  get isLoggedValue(): boolean {
    return this.isLogged.getValue();
  }

  login(authData: PlatformUser): Observable<PlatformUserResponse | void> {
    return this.http.post<PlatformUserResponse>(`${environment.API_URL}/auth/signin`, authData).pipe(
      map((userResponse: any) => {
        const decode = jwtHelper.decodeToken(userResponse.accessToken);
        const userRes: PlatformUserResponse = {
          name: decode.nombre,
          userEmail: authData.userEmail,
          role: decode.rol,
          // asociacion: decode.asociacion, // TODO: Obtine el tipo de asociación
          asociacion: [
            {
              id: 1,
              nombre: 'Facultad de Ingenieria'
            },
            {
              id: 2,
              nombre: 'Facultad de Comunicaciones'
            },
            {
              id: 3,
              nombre: 'Escuela de Idiomas'
            },
            {
              id: 4,
              nombre: 'Facultad de Medicina'
            },
            {
              id: 5,
              nombre: 'Facultad de Ciencias Agrarias'
            },
            {
              id: 6,
              nombre: 'Derecho y Ciencias Políticas'
            },
            {
              id: 7,
              nombre: 'Escuela de Microbiología'
            },
            {
              id: 8,
              nombre: 'Instituto de Filosofía'
            }
          ],
          token: userResponse.accessToken
        };
        localStorage.setItem('PlatformUser', JSON.stringify(userRes));
        this.PlatformUserRes.next(userRes);
        this.isLogged.next(true);
        return userRes;
      })
    );
  }

  register(userData: PlatformUser): Observable<PlatformUserResponse | void> {
    return this.http.post<PlatformUserResponse>(`${environment.API_URL}/users`, userData).pipe(
      map((user: PlatformUserResponse) => {
        // this.saveLocalStorage(user);
        return user;
      })
    );
  }

  private checkToken() {
    const platformUser = JSON.parse(localStorage.getItem('PlatformUser')) || null;
    if (platformUser) {
      const isExpired = jwtHelper.isTokenExpired(platformUser.token);
      if (isExpired) {
        this.logout();
      } else {
        this.PlatformUserRes.next(platformUser);
        this.isLogged.next(true);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.clear();
    this.PlatformUserRes.next(null);
    this.isLogged.next(false);
    this.router.navigate(['']);
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConditionRes} from '@app/shared/models/event-day.model';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {AuthService} from '@auth/services/auth.service';
import {PlatformUserResponse} from '@shared/models/platform-users.model';

@Injectable({
  providedIn: 'root'
})
export class EventDayService {

  conditions = `
    [
        {
            "condicion": "fecha nacimiento",
            "parametros": [
                {
                    "id": 1,
                    "valor": [
                        {
                            "id": 1,
                            "nombre": "cumpleaños"
                        }
                    ]
                }
            ]
        },
        {
            "condicion": "Genero",
            "parametros": [
                {
                    "id": 1,
                    "valor": [
                        {
                            "id": 1,
                            "nombre": "Másculino"
                        },
                        {
                            "id": 2,
                            "nombre": "Femenino"
                        },
                        {
                            "id": 3,
                            "nombre": "Otro"
                        }
                    ]
                }
            ]
        },
        {
            "condicion": "asociacion",
            "parametros": [
                {
                    "id": 1,
                    "valor": [
                        {
                            "id": 1,
                            "nombre": "Facultad de Ingenieria"
                        },
                        {
                            "id": 2,
                            "nombre": "Facultad de Comunicaciones"
                        },
                        {
                            "id": 3,
                            "nombre": "Escuela de Idiomas"
                        }
                    ]
                }
            ]
        },
        {
            "condicion": "programa",
            "parametros": [
                {
                    "id": 1,
                    "valor": [
                        {
                            "id": 501,
                            "nombre": "Ingenieria de Materiales"
                        },
                        {
                            "id": 504,
                            "nombre": "Ingenieria de Sistemas"
                        },
                        {
                            "id": 510,
                            "nombre": "Ingeniería electrónica"
                        },
                        {
                            "id": 525,
                            "nombre": "Ingenieria sanitaria"
                        }
                    ]
                }
            ]
        },
        {
            "condicion": "vinculacion",
            "parametros": [
                {
                    "id": 1,
                    "valor": [
                        {
                            "id": 1,
                            "nombre": "Estudiante"
                        },
                        {
                            "id": 2,
                            "nombre": "Auxiliar administrativo"
                        },
                        {
                            "id": 24,
                            "nombre": "Auxiliar de programación"
                        },
                        {
                            "id": 25,
                            "nombre": "Monitor"
                        },
                        {
                            "id": 26,
                            "nombre": "Docente de catedra"
                        },
                        {
                            "id": 27,
                            "nombre": "Docente de planta"
                        }
                    ]
                }
            ]
        }
    ]
  `;

  constructor(
    private http: HttpClient,
    private authSvc: AuthService
  ) {
  }

  getConditions(): Observable<ConditionRes[]> {
    let id: number;
    this.authSvc.userResponse$.subscribe((userRes: PlatformUserResponse) => {
      if (userRes) {
        id = userRes.id;
      }
    });
    return this.http
      .get<ConditionRes[]>(`${environment.API_URL}/evento/condicones/${id}`);
  }

}

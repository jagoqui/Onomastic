import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import SwAlert from 'sweetalert2';

type MODES = 'local' | 'test' | 'production';

@Injectable({
  providedIn: 'root'
})
export class AppModeService {

  constructor() {
    const appMode: MODES = localStorage.getItem('AppMode') as MODES;
    if (appMode) {
      this.mode = appMode;
      return;
    }
    AppModeService.defaultMode();
  }

  set mode(mode: MODES) {
    SwAlert.fire({
      title: `Va a cambiar al modo ${mode.toUpperCase()}, está seguro que dese hacerlo? `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar de modo!',
      cancelButtonText: 'Cancelar'
    }).then((resultDelete) => {
      if (resultDelete.isConfirmed) {
        SwAlert.fire({
          title: 'Ingrese la contraseña de pruebas para poder efectuar el cambio.',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          showLoaderOnConfirm: true
        }).then((result) => {
          if (result.value === '123456') {
            environment.apiUrl = environment.modesApp[mode];
            localStorage.removeItem('AuthRes');
            localStorage.setItem('AppMode', mode);
            SwAlert.fire({
              icon: 'success',
              title: 'Se cambio de modo exitosamente!',
              confirmButtonText: 'Aceptar!'
            }).then();
          } else {
            AppModeService.defaultMode();
            SwAlert.fire({
              icon: 'error',
              title: 'Error a ingresar crendeciales!',
              confirmButtonText: 'Aceptar!'
            }).then();
          }
        });
      } else {
        AppModeService.defaultMode();
      }
    });
  }

  private static defaultMode() {
    if (environment.production) {
      environment.apiUrl = environment.modesApp.production;
    } else {
      environment.apiUrl = environment.modesApp.test;
    }
  }
}

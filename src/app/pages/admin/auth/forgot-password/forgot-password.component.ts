import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '@adminShared/services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  template: ''
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  constructor(
    private router: Router,
    private athSvc: AuthService
  ) {
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Ingrese el correo para recuperar la contraseña',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      showLoaderOnConfirm: true,
      preConfirm: (email) => this.athSvc.sendMailResetPassword(email)
        .subscribe((_) => {
          Swal.fire({
            icon: 'success',
            title: `Por favor revise ${email} y siga las instrucciones para resetear la contraseña!`,
            confirmButtonText: 'Aceptar!'
          }).then(_ => this.router.navigate(['/login']).then());
        }, (err) => {
          console.log(err);
          Swal.showValidationMessage(
            `El correo no existe: ${err.status}`
          );
        }),
      allowOutsideClick: () => !Swal.isLoading()
    }).then((_) => this.router.navigate(['/login']));
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}

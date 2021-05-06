import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@adminShared/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  template: ''
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  private password: string = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {
  }

  ngOnInit(): void {
    this.password = null;
    const token = this.route.snapshot.paramMap.get('token');
    console.log(token);
    if (!token) {
      this.router.navigate(['/login']).then();
      this.ngOnDestroy();
    }
    Swal.mixin({
      input: 'password',
      confirmButtonText: 'Siguiente &rarr;',
      showConfirmButton: true,
      progressSteps: ['1', '2']
    }).queue([
      {
        title: 'Ingrese la nueva contraseña',
        preConfirm:(password: string) => this.onValidPassword(password)
      },
      {
        title: 'Ingrese de nuevo la contraseña',
        preConfirm:(passwordVerified: string) => {
         const onEqual = passwordVerified === this.password;
          if(!onEqual){
            Swal.showValidationMessage(
              'Las constraseñas no coinciden');
            return false;
          }
          return passwordVerified;
        }
      }
    ]).then((result: any) => {
      this.authSvc.resetPassword(token, result.value[1])
        .pipe(takeUntil(this.destroy$))
        .subscribe(_ => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada, ya puede iniciar sesión!',
            confirmButtonText: 'Aceptar!'
          }).then(_ => this.router.navigate(['/login']).then());
        },(err)=>{
          Swal.showValidationMessage(
            `Error al resetear la contraseña. ${err.status}`);
        });
    });
  }

  onValidPassword(password: string) {
    const errors = [];
    if (password.length > 20) {
      errors.push('No puede ingresar más de 20 caracteres');
    }
    if (password.length < 8) {
      errors.push('Ingrese al menos 8 caracteres');
    }
    if (password.search(/[a-z]/i) < 0) {
      errors.push('Debe de contener al menos una letra.');
    }
    if (password.search(/[0-9]/) < 0) {
      errors.push('Debe contener al menos un digito.');
    }
    if (errors.length > 0) {
      Swal.showValidationMessage(
        `Formato invalido: ${errors.join('\n')}`);
      return false;
    }
    this.password = password;
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}

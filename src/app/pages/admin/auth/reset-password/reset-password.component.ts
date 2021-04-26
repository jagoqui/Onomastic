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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService
  ) {
  }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.router.navigate(['/login']).then();
      return;
    }
    Swal.mixin({
      input: 'password',
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      {
        title: 'Ingrese la nueva contraseña',
        text: 'Bebe contener entre 8 y 20 caracteres!.'
      },
      'Ingrese de nuevo la contraseña'
    ]).then((result: any) => {
      if (result.value[0] === result.value[1] && result.value[1] >= 8 && result.value[1] <= 20) {
        this.authSvc.resetPassword(token, result.value[0])
          .pipe(takeUntil(this.destroy$))
          .subscribe(res=>{
            if(res){
              Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada!',
                confirmButtonText: 'Aceptar!'
              }).then(_ => this.router.navigate(['/login']).then());
            }
          });
      } else {
        Swal.fire({
          title: 'Las contraseñas no coinciden!. Desea volver a intentarlo?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar'
        }).then((resultDelete) => {
          if (resultDelete.isConfirmed) {
            this.ngOnInit();
          } else {
            this.router.navigate(['/login']).then();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}

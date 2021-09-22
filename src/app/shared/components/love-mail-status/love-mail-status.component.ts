import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import SwAlert from 'sweetalert2';
import {takeUntil} from 'rxjs/operators';
import {RecipientsLogService} from '@adminShared/services/recipients-log.service';

@Component({
  selector: 'app-love-mail-status',
  template: ''
})
export class LoveMailStatusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipientsLogSvc: RecipientsLogService
  ) {
  }

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    const eventId = this.route.snapshot.paramMap.get('event_id');

    let isFavorite: boolean;
    this.recipientsLogSvc.getLoveStatus(email, eventId).pipe(takeUntil(this.destroy$))
      .subscribe((favorite) => {
        isFavorite = favorite;
        SwAlert.fire({
          title: '¡Califícanos!',
          text: `${isFavorite ? 'Ya habías marcado cómo favorito tu correo, ya no te gusta?' : 'Si has llegado hasta aquí' +
            ' es porque te gusta nuestro correo 😍.'}`,
          icon: 'info',
          showCloseButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: `${isFavorite ? 'Debemos mejorar. 🥺' : 'Sí, ¡Me encata! 🥰'}`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.recipientsLogSvc.setLoveStatus(!isFavorite, email, eventId)
              .pipe(takeUntil(this.destroy$))
              .subscribe((recipientLog) => {
                if (recipientLog) {
                  SwAlert.fire({
                    icon: 'success',
                    title: 'Gracias por calificarnos',
                    footer: 'Tu opinión es de muy importante para nosotros para logar a que cada vez tengas una mejor' +
                      ' experiencia.',
                    showCloseButton: true,
                  }).then(_ => this.router.navigate(['/login']).then());
                } else {
                  SwAlert.fire(
                    '¡El usuario o evento asociado no existe!',
                    `
                        Para más información
                        <a href='${this.router.navigate(['PUBLISHER/help'])}'>Ayuda</a>.
                    `,
                    'error'
                  ).then(_ => this.router.navigate(['/login']).then());
                }
              }, () => SwAlert.showValidationMessage('Error calificando el evento.'));
          }
        });
      }, () => {
        SwAlert.showValidationMessage('Error obteniendo el estado del love.');
        this.router.navigate(['/login']).then();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}

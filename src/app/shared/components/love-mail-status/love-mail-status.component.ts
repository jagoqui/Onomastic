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
    console.log(email, eventId);

    let isFavorite: boolean;
    this.recipientsLogSvc.getLoveStatus(email, eventId).pipe(takeUntil(this.destroy$))
      .subscribe((favorite) => isFavorite = favorite); //TODO: Hacer await

    SwAlert.fire({
      title: '¡Calíficanos!',
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
                icon:'success',
                title: 'Gracias por calificarnos',
                footer: 'Tu opinión es de muy importante para nosotros para logar a que cada vez tengas una mejor' +
                  ' experiencia.',
                input: 'textarea',
                inputPlaceholder:'Cuentános que te pareció nuestro correo. [ max 50 carácteres]',
                inputAttributes: {
                  autocapitalize: 'off',
                  autocorrect: 'true'
                },
                showCancelButton: true,
                confirmButtonText: 'Enviar retroalimentación',
                cancelButtonText:'No tengo nada por decir',
                showLoaderOnConfirm: true,
                inputValidator: (result) => {
                  return !result && 'You need to agree with T&C';
                },
                preConfirm: (sentFeedback) => fetch(`//api.github.com/users/jagoqui`)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(response.statusText);
                      }
                      return response.json();
                    })
                    .catch(error => {
                      SwAlert.showValidationMessage(
                        `Petición fallida, ${error}`
                      );
                    }),
                allowOutsideClick: () => !SwAlert.isLoading()
              }).then((result) => {
                if (result.isConfirmed) {
                  SwAlert.fire({
                    title: `${result.value.login}'s avatar`,
                    imageUrl: result.value.avatar_url
                  }).then();
                }
              });
            } else {
              SwAlert.fire(
                '¡El usuario o evento asociado no existe!',
                `
                        Para más información
                        <a href='${this.router.navigate(['PUBLISHER/help'])}'>Ayuda</a>.
                    `,
                'error'
              ).then();
            }
          }, () => SwAlert.showValidationMessage('Error calificando el evento.'));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import SwAlert from 'sweetalert2';
import {EmailUsersService} from '@pages/¨publisher/services/email-users.service';

@Component({
  selector: 'app-mail-users-subscription-status',
  templateUrl: './mail-users-subscription-status.component.html',
  styleUrls: ['./mail-users-subscription-status.component.scss']
})
export class MailUsersSubscriptionStatusComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emailUserService: EmailUsersService
  ) {
  }

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    SwAlert.fire({
      title: 'Desea cancelar la subscripción de los correos de Onomástico?',
      text: 'Si la cancela no recibirá más correos de Onomástico!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelarla!',
      cancelButtonText: 'No, permanecer subscrito',
    }).then((result) => {
      if (result.isConfirmed) {
        const emailBase64 = btoa(email);
        this.emailUserService.unsubscribe(emailBase64).subscribe(res => {
          if (res) {
            SwAlert.fire(
              'Subscripción cancelada!',
              `
                        No recibirá más correos de Onomástico, para más información
                        <a href="${this.router.navigate(['PUBLISHER/help'])}">Ayuda</a>.
                    `,
              'success'
            ).then(r => console.log(r));
          }
        });
      } else {
        SwAlert.fire(
          'Subscripción renovada!',
          `
            Seguirá recibiendo los correos de Onomástico, para más información
            <a href="${this.router.navigate(['PUBLISHER/help'])}">Ayuda</a>.
          `,
          'info'
        ).then(r => console.log(r));
      }
    });
  }

}

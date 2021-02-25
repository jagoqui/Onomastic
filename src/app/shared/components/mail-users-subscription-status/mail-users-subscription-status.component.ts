import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import SwAlert from 'sweetalert2';

@Component({
  selector: 'app-mail-users-subscription-status',
  templateUrl: './mail-users-subscription-status.component.html',
  styleUrls: ['./mail-users-subscription-status.component.scss']
})
export class MailUsersSubscriptionStatusComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
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
        SwAlert.fire(
          'Subscripción cancelada!',
          `No recibirá más correos de Onomástico, para más información <a href="${this.route.navigate(['PUBLISHER/help'])}">Ayuda</a>.`,
          'success'
        );
      } else {
        SwAlert.fire(
          'Subscripción renovada!',
          `
            Seguirá recibiendo los correos de Onomástico, para más información <a href="${this.route.navigate(['PUBLISHER/help'])}">Ayuda</a>.
          `,
          'info'
        );
      }
    });
  }

}
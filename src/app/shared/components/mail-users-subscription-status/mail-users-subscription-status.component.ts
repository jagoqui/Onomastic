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
      title: 'Desea desubcribirse de los correos de Onomástico?',
      text: 'Si se desubcribe no recibirá más correos de Onomástico!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desubcribirme!'
    }).then((result) => {
      if (result.isConfirmed) {
        SwAlert.fire(
          'Desubcripción exitosa!',
          `No recibirá más correos de Onomástico, para más información <a href="${this.route.navigate(['PUBLISHER/help'])}">Ayuda</a>.`,
          'success'
        );
      } else {
        SwAlert.fire(
          'Desubcripción cancelada!',
          `
            Seguirá recibiendo los correos de Onomástico, para más información <a href="${this.route.navigate(['PUBLISHER/help'])}">Ayuda</a>.
          `,
          'info'
        );
      }
    });
  }

}

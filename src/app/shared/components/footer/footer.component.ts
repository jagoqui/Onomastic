import {Component, VERSION} from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z3 " fxLayout="row" fxLayoutAlign="space-between center">
      <div fxFLex fxLayout="column">
        <span>Onomástico</span>
        <span>Angular: {{version}}</span>
      </div>
      <div fxFLex fxLayout="column" fxLayoutAlign="end center">
        <span fxFlex>Universidad de Antioquia | Vigilada Mineducación | Acreditación institucional hasta el 2022 | NIT 890980040-8</span>
        <span fxFlex>Medellín - Colombia | Todos los Derechos Reservados © 2020</span>
      </div>
    </mat-toolbar>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  version = VERSION.full;
}

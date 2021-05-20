import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <mat-toolbar color='primary' class='mat-elevation-z3 ' fxLayout.xs='column' fxLayout.sm='column' fxLayout='row'
                 fxLayoutAlign='space-between center'>
      <div id='version' fxLayout='column'>
        <span>Onomástico</span>
        <span>Angular: {{version}}</span>
      </div>
      <div id='banner' fxLayout='column'>
        <span>Universidad de Antioquia | Vigilada Mineducación | Acreditación institucional hasta el 2022 | NIT 890980040-8</span>
        <span>Medellín - Colombia | Todos los Derechos Reservados © 2020</span>
      </div>
    </mat-toolbar>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  version = VERSION.full;
}

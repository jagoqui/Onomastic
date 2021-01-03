import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalComponent } from './components/modal/modal.component';

@Component({
  selector: 'app-templates-cards',
  templateUrl: './templates-cards.component.html',
  styleUrls: ['./templates-cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TemplatesCardsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onOpenModal(): void {
    this.dialog.open(ModalComponent, {
      height: 'auto',
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: 'Nueva tarjeta' },
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ModalEventDayComponent,} from './components/modal-event-day/modal-event-day.component';

@Component({
  selector: 'app-events-day',
  templateUrl: './events-day.component.html',
  styleUrls: ['./events-day.component.scss']
})
export class EventsDayComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  onOpenModal(event = {}): void {
    this.dialog.open(ModalEventDayComponent, {
      height: 'auto',
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: {title: event ? 'EDITAR EVENTO' : 'NUEVO EVENTO', event},
    });
  }
}

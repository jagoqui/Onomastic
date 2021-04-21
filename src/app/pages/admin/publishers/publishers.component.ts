import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalPublishersComponent, } from './components/modal-publishers/modal-publishers.component';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  onOpenModal(event = {}): void {
    const dialogRef = this.dialog.open(ModalPublishersComponent, {
      height: 'auto',
      width: '35%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: event ? 'NUEVO PUBLICADOR' : 'EDITAR PUBLICADOR', event }
    });
    // if (dialogRef.afterClosed()) {
    //   dialogRef.componentInstance.refresh.subscribe((refresh) => {
    //     if (refresh) {
    //       this.onRefresh();
    //     }
    //   });
    // }
  }

  ngOnInit(): void {
  }

}

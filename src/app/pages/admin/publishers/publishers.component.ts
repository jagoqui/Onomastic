import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ModalPublishersComponent,} from './components/modal-publishers/modal-publishers.component';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  onOpenModal(publisher = {}): void {
    this.dialog.open(ModalPublishersComponent, {
      hasBackdrop: true,
      data: {title: 'Nueva plantilla', publisher},
    });
  }

  ngOnInit(): void {
  }

}

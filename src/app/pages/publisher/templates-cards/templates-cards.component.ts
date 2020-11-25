import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent} from './components/modal/modal.component';

@Component({
  selector: 'app-templates-cards',
  templateUrl: './templates-cards.component.html',
  styleUrls: ['./templates-cards.component.scss']
})
export class TemplatesCardsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onOpenModal(): void {
    this.dialog.open(ModalComponent, {
      height: '100%',
      width: '100%',
      hasBackdrop: true,
      data: { title: 'New template' },
    });
  }
}

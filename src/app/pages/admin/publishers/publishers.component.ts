import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MailUsersComponent } from '@app/pages/publisher/mail-users/mail-users.component';
import { EmailUsersService } from '@app/pages/publisher/services/email-users.service';
import { PublisherService } from '@app/pages/publisher/services/publisher.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';
import { ModalPublishersComponent, } from './components/modal-publishers/modal-publishers.component';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit {

  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'nombre', 'email',
    'asociacion', 'estado',
    'acciones'
  ];
  private numPublisher = 0;
  private destroy$ = new Subject<any>();

  constructor(private dialog: MatDialog,
              private publisherSvc: PublisherService,
              private mailUsersSvc: EmailUsersService) {
  }

  onOpenModal(event = {}): void {
    const dialogRef = this.dialog.open(ModalPublishersComponent, {
      height: 'auto',
      width: '35%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: event ? 'EDITAR PUBLICADOR' : 'NUEVO PUBLICADOR', event }
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
    this.publisherSvc.getPublishers().subscribe((event) => {
      this.dataSource.data = event;
      this.numPublisher = this.dataSource.data.length;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPageSizeOptions(): number[] {
    const maxall = 100;
    if (this.dataSource.data.length > maxall) {
      return [5, 10, 20, 50, this.dataSource.data.length];
    } else {
      return [5, 10, 20, 50, maxall];
    }
  }
  onRefresh(refreshEvent?: boolean): void {
    if (refreshEvent || refreshEvent !== false) {
      this.destroy$.next({});
      this.destroy$.complete();
      this.ngOnInit();
    }
  }

  onSubscriptionStateChange(email: string, state: string) {
    const emailEncrypt = btoa(email);
    if (state === 'ACTIVO') {
      this.mailUsersSvc.unsubscribe(emailEncrypt)
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          if (user) {
            SwAlert.fire(`El usuario no recibirá más correos! `, '', 'success')
              .then(r => {
                this.onRefresh();
                console.log(r);
              });
          }
        });
    } else {
      this.mailUsersSvc.subscribe(emailEncrypt)
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          if (user) {
            SwAlert.fire(`El usuario comenzará a recibir correos! `, '', 'success')
              .then(r => {
                this.onRefresh();
                console.log(r);
              });
          }
        });
    }
  }

  onDelete(publisherId): void {
    SwAlert.fire({
      title: 'Está seguro?',
      text: 'Si elimina este publicador los cambios no podrán revertirse!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((resultDelete) => {
      if (resultDelete.isConfirmed) {
        this.publisherSvc
          .delete(publisherId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((_) => {
            SwAlert.fire(`El publicador fue eliminado! `, '', 'success')
              .then(_ => {
                this.onRefresh();
              });
          });
      }
    });
  }
}

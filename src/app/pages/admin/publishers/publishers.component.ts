import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';
import { ModalPublishersComponent, } from './components/modal-publishers/modal-publishers.component';
import { PublisherService } from '@adminShared/services/publisher.service';
import { Publisher } from '@adminShared/models/publisher.model';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit {

  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'nombre', 'email',
    'rol','estado'
  ];
  private numPublisher = 0;
  private destroy$ = new Subject<any>();

  constructor(private dialog: MatDialog,
              private publishersSvc: PublisherService) {
  }

  onOpenModal(publisher = {}): void {
    const dialogRef = this.dialog.open(ModalPublishersComponent, {
      height: 'auto',
      width: '50%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: publisher ? 'EDITAR PUBLICADOR' : 'NUEVO PUBLICADOR', publisher }
    });
    if (dialogRef.afterClosed()) {
      dialogRef.componentInstance.refresh.subscribe((refresh) => {
        if (refresh) {
          this.onRefresh();
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onRefresh(refreshEvent?: boolean): void {
    if (refreshEvent || refreshEvent !== false) {
      this.destroy$.next({});
      this.destroy$.complete();
      this.ngOnInit();
    }
  }

  onStateChange(email: string, state: string) {
    if (state === 'ACTIVO') {
      this.publishersSvc.deactivate(email)
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
      this.publishersSvc.activate(email)
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
        this.publishersSvc
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

  ngOnInit(): void {
    this.publishersSvc.getAll().subscribe((publisher) => {
      this.dataSource.data = publisher;
      //TODO: Crear un servicio desde el back para obtener el número de usuarios
      this.numPublisher = this.dataSource.data.length;
    });
  }

  showProperty(publisher: Publisher, property: string) {
    if(property=== 'rol'){
      return publisher[property].nombre;
    }
    return publisher[property];
  }
}

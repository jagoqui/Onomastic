import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';
import { ModalPublishersComponent } from './components/modal-publishers/modal-publishers.component';
import { PublisherService } from '@adminShared/services/publisher.service';
import { Publisher } from '@adminShared/models/publisher.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource= new MatTableDataSource();
  columnsToDisplay = [
    'nombre', 'email',
    'asociacionPorUsuario',
    'rol', 'estado', 'createTime'
  ];

  numPublisher = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private publishersSvc: PublisherService) {
  }

  showProperty(publisher: Publisher, key: string) {
    const values: Array<string> = [];
    if (typeof publisher[key] === 'object') {
      if(publisher[key]?.length){
        for (const property of publisher[key]) {
          if (property) {
            values.push(property.nombre);
          }
        }
      }else{
        values.push(publisher[key].nombre);
      }
    } else {
      values.push(publisher[key]);
    }
    return values;
  }

  onOpenModal(publisher: Publisher): void {
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

  onStateChange(email: string, state: string) {
    if (state === 'ACTIVO') {
      this.publishersSvc.deactivate(email)
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          if (user) {
            SwAlert.fire(`El publicador está desactivado! `, '', 'success')
              .then(r => this.onRefresh());
          }
        }, () => SwAlert.showValidationMessage('Error desactivando publicador'));
    } else {
      this.publishersSvc.activate(email)
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          if (user) {
            SwAlert.fire(`El publicador está activado! `, '', 'success')
              .then(() => this.onRefresh());
          }
        }, () => SwAlert.showValidationMessage('Error activando publicador'));
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
              .then(() => this.onRefresh());
          }, () => SwAlert.showValidationMessage('Error eliminado publicador'));
      }
    });
  }

  onRefresh(refreshEvent?: boolean): void {
    if (refreshEvent || refreshEvent !== false) {
      this.destroy$.next({});
      this.destroy$.complete();
      this.ngOnInit();
    }
  }


  ngOnInit(): void {
    this.publishersSvc.getAll().subscribe((publisher) => {
      this.dataSource.data  = publisher;
      //TODO: Crear un servicio desde el back para obtener el número de publicadores
      this.numPublisher = this.dataSource.data.length;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}

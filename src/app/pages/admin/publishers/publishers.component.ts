import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss'],
  providers: [DatePipe]
})
export class PublishersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'nombre', 'email',
    'asociacionPorUsuario',
    'rol', 'estado', 'createTime'
  ];

  numPublisher = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private publishersSvc: PublisherService,
    private datePipe: DatePipe) {
  }

  showProperty(publisher: Publisher, key: string) {
    const values: Array<string> = [];
    if (typeof publisher[key] === 'object') {
      if (publisher[key]?.length) {
        for (const property of publisher[key]) {
          if (property) {
            values.push(property.nombre);
          }
        }
      } else {
        values.push(publisher[key].nombre);
      }
    } else {
      values.push(publisher[key]);
    }
    if (key === 'createTime') {
      values[0] = this.datePipe.transform(values[0], 'yyyy-MM-dd');
    }
    return values;
  }

  onOpenModal(publisher: Publisher): void {
    const dialogRef = this.dialog.open(ModalPublishersComponent, {
      height: 'auto',
      width: 'auto',
      maxWidth:'95%',
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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
    this.publishersSvc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((publisher) => {
        this.dataSource.data = publisher;
        //TODO: Crear un servicio desde el back para obtener el número de publicadores
        this.numPublisher = this.dataSource.data.length;
      }, () => {
        SwAlert.showValidationMessage(
          `No se pudo cargar los pubicadores.`);
      });
    //TODO: Filtrar por asociacion
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    this.dataSource.filterPredicate = function(data: Publisher, filter: string): boolean {
      return data.nombre.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter)
        || data.rol.nombre.toLowerCase().includes(filter) || data.estado.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}

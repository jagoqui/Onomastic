import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ID } from '@shared/models/mail-users.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EmailUserService } from '../services/email-user.service';
import { ModalMailUsersComponent } from './components/modal-mail-users/modal-mail-users.component';
import SwAlert from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './mail-users.component.html',
  styleUrls: ['./mail-users.component.scss']
})
export class MailUsersComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  columnsToDisplay = [
    'id', 'plataformaPorUsuarioCorreo',
    'nombre', 'email', 'fechaNacimiento',
    'vinculacionPorUsuarioCorreo',
    'asociacionPorUsuarioCorreo',
    'programaAcademicoPorUsuarioCorreo',
    'estado', 'actions'
  ];
  dataSource = new MatTableDataSource();
  private numUsers = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialog: MatDialog, private mailUsersSvc: EmailUserService
  ) {
  }

  getPartialUsers(): string {
    let x = ('' + this.numUsers).length;
    const p = Math.pow;
    const d = p(10, 1);
    x -= x % 3;
    return Math.round(this.numUsers * d / p(10, x)) / d + ' kMGTPE'[x / 3];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onOpenModal(user = {}) {
    const dialogRef = this.dialog.open(ModalMailUsersComponent, {
      height: 'auto',
      width: '45%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: user ? 'Actualizar destinatario' : 'Nuevo destinatario', user }
    });
    if (dialogRef.afterClosed()) {
      dialogRef.componentInstance.refresh.subscribe((refresh) => {
        if (refresh) {
          this.onRefresh();
        }
      });
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
      this.mailUsersSvc.subscribe(email) // TODO: Pedir que el back resiba el email encriptado
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

  onDelete(userId: ID): void {
    SwAlert.fire({
      title: 'Está seguro que desea eliminar el destinatario?. Los cambios no podrán revertirse!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((resultDelete) => {
        if (resultDelete.isConfirmed) {
          this.mailUsersSvc
            .delete(userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((_) => {
              SwAlert.fire('Eliminado!', 'El destinatario se ha eliminado', 'success').then();
              this.ngOnInit();
            });
        }
      }
    );
  }

  onRefresh(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.mailUsersSvc.getAll().subscribe((user) => {
      this.dataSource.data = user;
      this.numUsers = this.dataSource.data.length;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}

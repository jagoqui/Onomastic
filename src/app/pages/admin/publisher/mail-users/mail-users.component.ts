import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EmailUserService } from '../shared/services/email-user.service';
import { ModalMailUsersComponent } from './components/modal-mail-users/modal-mail-users.component';
import SwAlert from 'sweetalert2';
import { ID } from '@adminShared/models/shared.model';
import { MailsLogService } from '@app/pages/admin/shared/services/mails-log.service';
import { MailUsers } from '@adminShared/models/mail-users.model';
import { ModalMailsLogComponent } from '@publisher/mail-users/components/modal-mails-log/modal-mails-log.component';

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
  private numMailsDataSent = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private mailUserSvc: EmailUserService,
    private mailDataSentSvc: MailsLogService
  ) {
  }

  get numMailUser(): string {
    return this.getPartialUsers(this.numUsers);
  }

  get numMailsSent(): string {
    return this.getPartialUsers(this.numMailsDataSent);
  }

  openModalLogs() {
    const dialogRef = this.dialog.open(ModalMailsLogComponent, {
      height: 'auto',
      width: '100%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: 'HISTORIAL DE CORREOS ENVIADOS'}
    });
    if (dialogRef.afterClosed()) {
      dialogRef.componentInstance.refresh
        .pipe(takeUntil(this.destroy$))
        .subscribe((refresh) => {
          if (refresh) {
            this.onRefresh();
          }
        });
    }
  }
  onOpenModalForm(user: MailUsers) {
    const dialogRef = this.dialog.open(ModalMailUsersComponent, {
      height: 'auto',
      width: '90%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: user ? 'Actualizar destinatario' : 'Nuevo destinatario', user }
    });
    if (dialogRef.afterClosed()) {
      dialogRef.componentInstance.refresh
        .pipe(takeUntil(this.destroy$))
        .subscribe((refresh) => {
          if (refresh) {
            this.onRefresh();
          }
        });
    }
  }

  getPartialUsers(numData: number): string {
    let x: number = ('' + numData).length;
    const p = Math.pow;
    const d = p(10, 1);
    x -= x % 3;
    return Math.round(numData * d / p(10, x)) / d + ' kMGTPE'[x / 3];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubscriptionStateChange(email: string, state: string) {
    const emailEncrypt = btoa(email);
    if (state === 'ACTIVO') {
      this.mailUserSvc.unsubscribe(emailEncrypt)
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          if (user) {
            SwAlert.fire(`El usuario no recibirá más correos! `, '', 'success')
              .then(() => {
                this.onRefresh();
              });
          }
        }, () => {
          SwAlert.showValidationMessage('Error desactivando destinatario');
        });
    } else {
      this.mailUserSvc.subscribe(email) // TODO: Pedir que el back resiba el email encriptado
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          if (user) {
            SwAlert.fire(`El usuario comenzará a recibir correos! `, '', 'success')
              .then(() => {
                this.onRefresh();
              });
          }
        }, () => {
          SwAlert.showValidationMessage('Error activando destinatario');
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
          this.mailUserSvc
            .delete(userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((_) => {
              SwAlert.fire('Eliminado!', 'El destinatario se ha eliminado', 'success').then();
              this.ngOnInit();
            }, () => {
              SwAlert.showValidationMessage('Error elimando las destinatario');
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
    this.mailUserSvc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.dataSource.data = user;
        this.numUsers = this.dataSource.data.length;
      }, () => {
        SwAlert.showValidationMessage('Error cargando los destinatarios');
      });
    this.mailDataSentSvc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataSent) => {
        this.numMailsDataSent = dataSent.length;
      }, () => {
        SwAlert.showValidationMessage('Error cargando las los correos enviados');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}

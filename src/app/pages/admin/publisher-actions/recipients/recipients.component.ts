import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';

import {RecipientService} from '../shared/services/recipient.service';
import {ModalRecipientsComponent} from './components/modal-recipients/modal-recipients.component';
import SwAlert from 'sweetalert2';
import {ID} from '@adminShared/models/shared.model';
import {RecipientsLogService} from '@adminShared/services/recipients-log.service';
import {Recipient} from '@adminShared/models/recipient.model';
import {ModalRecipientsLogComponent} from '@admin//publisher-actions/recipients/components/modal-recipients-log/modal-recipients-log.component';
import {FriendlyNumberAbbreviationService} from '@appShared/services/friendly-number-abbreviation.service';
import {FormControl} from '@angular/forms';
import {AuthService} from '@adminShared/services/auth.service';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.scss']
})
export class RecipientsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay = [
    'id', 'plataformaPorUsuarioCorreo',
    'nombre', 'email', 'fechaNacimiento',
    'vinculacionPorUsuarioCorreo',
    'unidadAcademicaPorCorreoUsuario',
    'unidadAdministrativaPorCorreoUsuario',
    'programaAcademicoPorUsuarioCorreo',
    'estado', 'actions'
  ];
  search = new FormControl('');
  dataSource = new MatTableDataSource();

  private numRecipients = 0;
  private numRecipientsDataSent = 0;
  private destroy$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private friendlyNumberSvc: FriendlyNumberAbbreviationService,
    private recipientUserSvc: RecipientService,
    private recipientsDataSentSvc: RecipientsLogService,
    private authSvc: AuthService
  ) {
    this.onSearch();
  }

  get isAdmin(): boolean {
    return this.authSvc.isPublisherAdmin;
  }

  get quantityRecipients(): string {
    return this.friendlyNumberSvc.getFriendlyFormat(this.numRecipients);
  }

  get numMailsSent(): string {
    return this.friendlyNumberSvc.getFriendlyFormat(this.numRecipientsDataSent);
  }

  openModalLogs() {
    const dialogRef = this.dialog.open(ModalRecipientsLogComponent, {
      height: 'auto',
      width: 'auto',
      maxWidth: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: {title: 'HISTORIAL DE CORREOS ENVIADOS'}
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

  onOpenModalForm(user: Recipient) {
    const dialogRef = this.dialog.open(ModalRecipientsComponent, {
      height: 'auto',
      width: 'auto',
      maxWidth: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: {title: user ? 'Actualizar destinatario' : 'Nuevo destinatario', user}
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

  onChange(key: string) {
    if (key === 'Backspace') {
      this.search.valueChanges.pipe(
        map(search => search?.toLowerCase().trim()),
        debounceTime(300),
        filter(search => search === ''),
        tap(() => this.onClear()),
        takeUntil(this.destroy$)
      ).subscribe();
    }
  }

  onClear(): void {
    this.search.reset();
    this.dataSource.filter = null;
  }

  onSearch(): void {
    this.search.valueChanges.pipe(
      map(search => search?.toLowerCase().trim()),
      debounceTime(300),
      distinctUntilChanged(),
      filter(search => search !== '' && search?.length > 2),
      tap(search => this.dataSource.filter = search),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  onSubscriptionStateChange(email: string, state: string) {
    const emailEncrypt = btoa(email);
    if (state === 'ACTIVO') {
      this.recipientUserSvc.unsubscribe(emailEncrypt)
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
      this.recipientUserSvc.subscribe(email) // TODO: Pedir que el back resiba el email encriptado
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
          this.recipientUserSvc
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
    this.recipientUserSvc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.dataSource.data = user;
        this.numRecipients = this.dataSource.data.length;
      }, () => {
        SwAlert.showValidationMessage('Error cargando los destinatarios');
      });
    this.recipientsDataSentSvc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataSent) => {
        this.numRecipientsDataSent = dataSent.length;
      }, () => {
        SwAlert.showValidationMessage('Error cargando los correos enviados');
      });
    // TODO: falta filtrar por asociacion, vunculacion y programa
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    this.dataSource.filterPredicate = function(data: Recipient, filter: string): boolean {
      return data.id.numeroIdentificacion.toLowerCase().includes(filter) || data.nombre.toLowerCase().includes(filter)
        || data.apellido.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter)
        || data.estado.toLowerCase().includes(filter);
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}

import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';
import { Subject } from 'rxjs';
import { LoaderService } from '@app/shared/services/loader.service';
import { ACTIONS, ByIdOrCode } from '@adminShared/models/shared.model';
import { PublisherService } from '@adminShared/services/publisher.service';
import { AssociationService } from '@adminShared/services/association.service';
import { BaseFormPublisher } from '@adminShared/utils/base-form-publisher';
import { Publisher, Role } from '@adminShared/models/publisher.model';

// eslint-disable-next-line no-shadow
enum Action {
  edit = 'edit',
  new = 'new',
}

@Component({
  selector: 'app-modal-publishers',
  templateUrl: './modal-publishers.component.html',
  styleUrls: ['./modal-publishers.component.scss']
})
export class ModalPublishersComponent implements OnInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);

  actionTODO: ACTIONS;
  showPasswordField = true;
  hide = true;
  maxListsConfig = {
    associations: 4
  };
  associationsRes: ByIdOrCode[];
  roleOptions: Role[] = [
    {
      id: 1,
      nombre: 'ADMIN'
    },
    {
      id: 2,
      nombre: 'PUBLISHER'
    }
  ];
  private destroy$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalPublishersComponent>,
    public publisherForm: BaseFormPublisher,
    private publisherSvc: PublisherService,
    private associationSvc: AssociationService,
    private loaderSvc: LoaderService
  ) {
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.publisherForm.controls;
  }

  removeAssociation(i: number) {
    this.publisherForm.removeAssociation(i);
  }

  onClose(close?: boolean): void {
    console.log(this.publisherForm.baseForm.value);
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.publisherForm.onReset();
      this.refresh.emit(true);
      this.dialogRef.close();
    }
  }

  onSave() {
    this.publisherSvc.new(this.publisherForm.baseForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(publisher => {
        if (publisher) {
          SwAlert.fire(
            'Guardado!',
            '<b>El publicador ha sido guardado</b>',
            'success').then(r => console.log(r)).then(r => console.log(r));
          this.onClose(true);
        }
      }, (err) => {
        console.table('Error guardando el publicador :> ', this.publisherForm.baseForm.value);
        SwAlert.fire({
          icon: 'error',
          html: '',
          title: 'Oops...',
          text: ' Algo salió mal!',
          footer: `${err}`
        }).then(_ => {
          this.loaderSvc.setLoading(false);
        });
      });
  }

  ngOnInit(): void {
    this.publisherForm.baseForm.get('password').setValidators(null);
    this.publisherForm.baseForm.get('password').updateValueAndValidity();

    if (this.data?.publisher) {
      this.actionTODO = 'EDITAR';
      this.pathFormData(this.data.publisher);
    } else {
      this.actionTODO = 'AGREGAR';
    }

    this.associationSvc.getAssociations()
      .subscribe(associations => {
        if (associations) {
          this.associationsRes = associations;
        }
      }, (err) => {
        console.log('Get condition error! :> ', err);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };

  private pathFormData(event: Publisher): void {
    const associations = event.asociacionPorUsuario;

    for (let i = 0; i < associations.length - 1; i++) {
      this.publisherForm.addAssociation();
    }
    this.publisherForm.baseForm.patchValue(event);
  }
}

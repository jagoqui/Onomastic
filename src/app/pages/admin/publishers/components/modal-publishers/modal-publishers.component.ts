import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';
import { Subject } from 'rxjs';
import { ACTIONS, ByIdAndName } from '@adminShared/models/shared.model';
import { PublisherService } from '@adminShared/services/publisher.service';
import { UnitsService } from '@adminShared/services/units.service';
import { BaseFormPublisher } from '@adminShared/utils/base-form-publisher';
import { Publisher, Role } from '@adminShared/models/publisher.model';


@Component({
  selector: 'app-modal-publishers',
  templateUrl: './modal-publishers.component.html',
  styleUrls: ['./modal-publishers.component.scss']
})
export class ModalPublishersComponent implements OnInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);

  actionTODO: ACTIONS;
  administrativeUnits: ByIdAndName[];
  academicUnits: ByIdAndName[];

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
    private unitSvc: UnitsService
  ) {
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.publisherForm.controls;
  }

  formIsValid(): boolean {
    this.controls.unidadAcademicaPorUsuario.setErrors(null);
    this.controls.unidadAdministrativaPorUsuario.setErrors(null);
    return this.publisherForm.baseForm.valid && this.isSelectAtLeastOneUnit();
  }

  isSelectAtLeastOneUnit(): boolean {
    const numAcademicUnits: boolean = this.publisherForm.baseForm.value.unidadAcademicaPorUsuario?.length>0;
    const numAdministrativeUnits: boolean = this.publisherForm.baseForm.value.unidadAdministrativaPorUsuario?.length>0;
    return numAcademicUnits || numAdministrativeUnits;
  }

  onClose(close?: boolean): void {
    console.warn(this.publisherForm.baseForm);
    if (close ? close : confirm('No se han guardado los cambios, desea salir?')) {
      this.publisherForm.baseForm.reset();
      this.refresh.emit(true);
      this.dialogRef.close();
    }
  }

  onRefresh() {
    this.refresh.emit(true);
    this.ngOnInit();
  }

  onSave() {
    const publisher: Publisher = this.publisherForm.baseForm.value;
    this.publisherSvc.save(publisher)
      .pipe(takeUntil(this.destroy$))
      .subscribe(publisher => {
        if (publisher) {
          SwAlert.fire(
            `${this.actionTODO === 'AGREGAR' ? 'GUARDADO' : 'ACTUALIZADO'}`,
            `<b>El publicador se pudo ${this.actionTODO.toLowerCase()} exitosamente</b>`,
            'success').then();
          this.onClose(true);
        }
      }, () => SwAlert.showValidationMessage(`Error  al ${this.actionTODO.toLowerCase()} el publicador`));
  }

  ngOnInit(): void {
    const publisher = this.data?.publisher;
    if (publisher) {
      this.actionTODO = 'EDITAR';
      this.publisherForm.baseForm.patchValue(publisher);
    } else {
      this.publisherForm.baseForm.get('id').setValidators(null);
      this.publisherForm.baseForm.get('id').updateValueAndValidity();
      this.actionTODO = 'AGREGAR';
    }

    this.publisherForm.baseForm.get('createTime').setValidators(null);
    this.publisherForm.baseForm.get('createTime').updateValueAndValidity();
    this.publisherForm.baseForm.get('unidadAcademicaPorUsuario').setValidators(null);
    this.publisherForm.baseForm.get('unidadAcademicaPorUsuario').updateValueAndValidity();
    this.publisherForm.baseForm.get('unidadAdministrativaPorUsuario').setValidators(null);
    this.publisherForm.baseForm.get('unidadAdministrativaPorUsuario').updateValueAndValidity();

    this.unitSvc.getAcademicUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe((academicUnits) => {
        if (academicUnits) {
          this.academicUnits = academicUnits;
        }
      }, () => {
        SwAlert.showValidationMessage('Error cargando las unidades académicas.');
      });

    this.unitSvc.getAdministrativeUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe((administrativeUnits) => {
        if (administrativeUnits) {
          this.administrativeUnits = administrativeUnits;
        }
      }, () => SwAlert.showValidationMessage('Error obteniendo unidades administrativas'));
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}

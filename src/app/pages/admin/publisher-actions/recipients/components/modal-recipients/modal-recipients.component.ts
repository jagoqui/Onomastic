import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as moment from 'moment';
import {Subscription} from 'rxjs';

import {RecipientService} from '../../../shared/services/recipient.service';
import {BaseFormMailUsers} from '@pages/admin/publisher-actions/shared/utils/base-form-mail-users';
import SwAlert from 'sweetalert2';
import {PlatformService} from '@pages/admin/shared/services/platform.service';
import {UnitsService} from '@adminShared/services/units.service';
import {AcademicProgramService} from '@pages/admin/shared/services/academic-program.service';
import {BodyTypeService} from '@pages/admin/shared/services/body-type.service';
import {ACTIONS, ByIdAndName, DATE_FORMAT, Program} from '@adminShared/models/shared.model';


@Component({
  selector: 'app-modal-recipients',
  templateUrl: './modal-recipients.html',
  styleUrls: ['./modal-recipients.component.scss'],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT}
  ]
})
export class ModalRecipientsComponent implements OnInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);

  actionTODO: ACTIONS;
  maxListsConfig = {
    units: 4,
    program: 2,
    bodyType: 4,
    platforms: 4
  };
  today = new Date();
  close = false;
  administrativeUnits: ByIdAndName[];
  programs: Program[];
  bondingTypes: ByIdAndName[];
  platforms: ByIdAndName[];
  private subscription: Subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<ModalRecipientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userSvc: RecipientService,
    private platformSvc: PlatformService,
    private unitSvc: UnitsService,
    private academicProgramSvc: AcademicProgramService,
    private bodyTypeSvc: BodyTypeService,
    public mailUserForm: BaseFormMailUsers
  ) {
  }

  setBirthdayFormat(event: MatDatepickerInputEvent<Date>) {
    this.mailUserForm.baseForm.controls.fechaNacimiento.setValue(moment(event.value).format('YYYY-MM-DD'));
  }

  checkField(field: string, group?: string, iterator?: number): boolean {
    return this.mailUserForm.isValidField(field, group, iterator);
  }

  onRefresh() {
    this.refresh.emit(true);
    this.ngOnInit();
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.mailUserForm.baseForm.reset();
      this.refresh.emit(true);
      this.dialogRef.close();
    }
  }

  onSave(): void {
    const user = this.mailUserForm.baseForm.value;
    this.userSvc.save(user, this.actionTODO === 'EDITAR' ? user.id : null).subscribe(() => {
      SwAlert.fire(
        `${this.actionTODO === 'AGREGAR' ? 'GUARDADO' : 'ACTUALIZADO'}`,
        `<b>El destinatario se pudo ${this.actionTODO.toLowerCase()} exitosamente</b>`,
        'success').then();
      this.onClose(true);
      this.refresh.emit(true);
      this.mailUserForm.baseForm.reset();
    }, () => SwAlert.showValidationMessage(`Error  al ${this.actionTODO.toLowerCase()} el destinatario`));
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.actionTODO = 'EDITAR';
      this.mailUserForm.baseForm.patchValue(this.data.user);
    } else {
      this.mailUserForm.baseForm.get('id').setValidators(null);
      this.mailUserForm.baseForm.get('id').updateValueAndValidity();
      this.actionTODO = 'AGREGAR';
    }

    this.subscription.add(
      this.unitSvc.getAdministrativeUnits()
        .subscribe(administrativeUnits => {
          if (administrativeUnits) {
            this.administrativeUnits = administrativeUnits;
          }
        }, () => {
          SwAlert.showValidationMessage('Error cargando las unidades administrativas.');
        })
    );

    this.subscription.add(
      this.academicProgramSvc.getAcademicPrograms()
        .subscribe((programs) => {
          if (programs) {
            this.programs = programs;
          }
        }, () => {
          SwAlert.showValidationMessage('Error cargando los programas academicos');
        })
    );

    this.subscription.add(
      this.bodyTypeSvc.getBondingTypes()
        .subscribe(types => {
          if (types) {
            this.bondingTypes = types;
          }
        }, () => {
          SwAlert.showValidationMessage('Error cargando las vinculaciones');
        })
    );

    this.subscription.add(
      this.platformSvc.getPlatforms().subscribe(platforms => {
        if (platforms) {
          this.platforms = platforms;
        }
      }, () => {
        SwAlert.showValidationMessage('Error cargando las plataformas');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

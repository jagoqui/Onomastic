import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { EmailUserService } from '../../../shared/services/email-user.service';
import { BaseFormMailUsers } from '@pages/admin/publisher/shared/utils/base-form-mail-users';
import SwAlert from 'sweetalert2';
import { PlatformService } from '@pages/admin/shared/services/platform.service';
import { AssociationService } from '@pages/admin/shared/services/association.service';
import { AcademicProgramService } from '@pages/admin/shared/services/academic-program.service';
import { BodyTypeService } from '@pages/admin/shared/services/body-type.service';
import { ByIdOrCode } from '@adminShared/models/shared.model';

// eslint-disable-next-line no-shadow
enum Action {
  edit = 'Actualizar',
  new = 'Agregar',
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-modal-mail-users',
  templateUrl: './modal-mail-users.component.html',
  styleUrls: ['./modal-mail-users.component.scss'],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModalMailUsersComponent implements OnInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);

  actionTODO = '';
  maxListsConfig = {
    associations: 4,
    program: 2,
    bodyType: 4,
    platforms: 4
  };
  today = new Date();
  close = false;
  associations: ByIdOrCode[];
  programs: ByIdOrCode[];
  bondingTypes: ByIdOrCode[];
  platforms: ByIdOrCode[];
  private subscription: Subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userSvc: EmailUserService,
    private platformSvc: PlatformService,
    private associationSvc: AssociationService,
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


  onClose(close?: boolean): void {
    console.log(this.mailUserForm.baseForm.value);
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.mailUserForm.baseForm.reset();
      this.refresh.emit(true);
      this.dialogRef.close();
    }
  }

  onSave(): void {
    const user = this.mailUserForm.baseForm.value;
    this.userSvc.saveMailUser(user, this.data?.user?.id).subscribe(_ => {
      SwAlert.fire(`Destinatario ${this.data?.user ? 'Actualizado!' : 'Guardado!'} `, '', 'success').then();
      this.onClose(true);
      this.refresh.emit(true);
      this.mailUserForm.baseForm.reset();
    }, () => {
      SwAlert.showValidationMessage('El destinatario no se guardó');
    });
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.actionTODO = Action.edit;
      this.mailUserForm.baseForm.patchValue(this.data.user);
    } else {
      this.actionTODO = Action.new;
    }

    this.subscription.add(
      this.associationSvc.getAssociations().subscribe(associations => {
        if (associations) {
          this.associations = associations;
        }
      }, () => {
        SwAlert.showValidationMessage('Error cargando las asociaciones');
      })
    );

    this.subscription.add(
      this.academicProgramSvc.getAcademicPrograms().subscribe(programs => {
        if (programs) {
          this.programs = programs;
        }
      }, () => {
        SwAlert.showValidationMessage('Error cargando los programas academicos');
      })
    );

    this.subscription.add(
      this.bodyTypeSvc.getBondingTypes().subscribe(types => {
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

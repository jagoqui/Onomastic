import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  ByNameId,
  ProgramaAcademicoPorUsuarioCorreo,
} from 'src/app/shared/models/mail-users.model';
import { BaseFormMailUsers } from 'src/app/shared/utils/base-form-mail-users';

import { EmailUsersService } from '../../../services/email-users.service';

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

enum Action {
  EDIT = 'Actualizar',
  NEW = 'Agregar',
}

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

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ModalMailUsersComponent implements OnInit, OnDestroy {
  actionTODO = '';
  showPasswordField = true;
  close = false;
  private subscripcion: Subscription = new Subscription();

  associations: ByNameId[];
  programs: ProgramaAcademicoPorUsuarioCorreo[];
  bondingTypes: ByNameId[];

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userSvc: EmailUsersService,
    public mailUserForm: BaseFormMailUsers
  ) { }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    const { getDate } = event.value;
    console.log(getDate);
  }

  checkField(field: string, group?: string): boolean {
    return this.mailUserForm.isValidField(field, group);
  }

  handleKeyDown(event: any) {
    if (event.keyCode === 'Enter') {
      this.onSave();
      event.default();
    }
  }

  addByNameFormGroup(formGroup: string): void {
    this.mailUserForm.addByNameFormGroup(formGroup);
  }

  removeOrClearByName(i: number, formGroup: string): void {
    this.mailUserForm.removeOrClearByName(i, formGroup);
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, quiere salir?')) {
      this.mailUserForm.onReset();
      this.dialogRef.close();
    }
  }

  onSave(): void {
    this.onClose(true);
    this.mailUserForm.onReset();
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.actionTODO = Action.EDIT;
    } else {
      this.actionTODO = Action.NEW;
    }

    this.subscripcion.add(
      this.userSvc.getAssociations().subscribe(associations => {
        if (associations) {
          this.associations = associations;
        }
      })
    );

    this.subscripcion.add(
      this.userSvc.getBondingType().subscribe(types => {
        if (types) {
          this.bondingTypes = types;
        }
      })
    );

    this.subscripcion.add(
      this.userSvc.getAcademicPrograms().subscribe(programs => {
        if (programs) {
          this.programs = programs;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }

}

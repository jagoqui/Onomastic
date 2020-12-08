import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
import * as moment from 'moment';
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
  maxListsConfig = {
    associations: 4,
    program: 2,
    bodyType: 4,
    platforms: 4,
  };

  close = false;
  private subscripcion: Subscription = new Subscription();

  associations: ByNameId[];
  programs: ProgramaAcademicoPorUsuarioCorreo[];
  bondingTypes: ByNameId[];
  platforms: ByNameId[];

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userSvc: EmailUsersService,
    public mailUserForm: BaseFormMailUsers
  ) { }

  private pathFormData(): void {
    this.mailUserForm.baseForm.patchValue(this.data?.user);
  }

  setBirtdayFormat(event: MatDatepickerInputEvent<Date>) {
    this.mailUserForm.baseForm.controls.fechaNacimiento.setValue(moment(event.value).format('YYYY-MM-DD'));
  }

  checkField(field: string, group?: string, i?: number): boolean {
    return this.mailUserForm.isValidField(field, group, i);
  }

  handleKeyDown(event: any) {
    if (event.keyCode === 'Enter') {
      this.onSave();
      event.default();
    }
  }

  setformGropuID(formGroup: FormGroup, id: number) {
    formGroup.controls.id.setValue(id);
  }

  setformGropuCode(formGroup: FormGroup, code: number) {
    formGroup.controls.codigo.setValue(code);
  }

  addByNameFormGroup(formGroup: string): void {
    this.mailUserForm.addByNameFormGroup(formGroup);
  }

  removeOrClearByName(i: number, formGroup: string, onClose?: boolean): void {
    if (!onClose) {
      if (confirm('Seguro que desea remover la lista?')) {
        this.mailUserForm.removeOrClearByName(i, formGroup);
      }
    } else {
      this.mailUserForm.removeOrClearByName(i, formGroup);
    }
  }

  onShowAddAssociation(i: number): boolean {
    return (i === (this.getAssociationsSize() - 1) && (this.getAssociationsSize() < this.maxListsConfig.associations));
  }

  getAssociationsSize(): number {
    return this.mailUserForm.baseForm.controls.asociacionPorUsuarioCorreo.value.length;
  }

  onShowAddProgram(i: number): boolean {
    return (i === (this.getProgramsSize() - 1) && (this.getProgramsSize() < this.maxListsConfig.program));
  }

  getProgramsSize(): number {
    return this.mailUserForm.baseForm.controls.programaAcademicoPorUsuarioCorreo.value.length;
  }

  onShowAddBodyType(i: number): boolean {
    return (i === (this.getBodyTypesSize() - 1) && (this.getBodyTypesSize() < this.maxListsConfig.bodyType));
  }

  getPlatformsSize(): number {
    return this.mailUserForm.baseForm.controls.plataformaPorUsuarioCorreo.value.length;
  }

  onShowPlatforms(i: number): boolean {
    return (i === (this.getPlatformsSize() - 1) && (this.getPlatformsSize() < this.maxListsConfig.platforms));
  }

  getBodyTypesSize(): number {
    return this.mailUserForm.baseForm.controls.vinculacionPorUsuarioCorreo.value.length;
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.mailUserForm.onReset();
      this.dialogRef.close();

      const associtions = this.mailUserForm.baseForm.controls.asociacionPorUsuarioCorreo.value;
      const bodyTypes = this.mailUserForm.baseForm.controls.vinculacionPorUsuarioCorreo.value;
      const programs = this.mailUserForm.baseForm.controls.programaAcademicoPorUsuarioCorreo.value;
      const platforms = this.mailUserForm.baseForm.controls.plataformaPorUsuarioCorreo.value;

      for (const assocition of associtions) {
        this.removeOrClearByName(assocition, 'asociacionPorUsuarioCorreo', true);
      }
      for (const bodyType of bodyTypes) {
        this.removeOrClearByName(bodyType, 'vinculacionPorUsuarioCorreo', true);
      }
      for (const program of programs) {
        this.removeOrClearByName(program, 'programaAcademicoPorUsuarioCorreo', true);
      }
      for (const platform of platforms) {
        this.removeOrClearByName(platforms, 'plataformaPorUsuarioCorreo', true);
      }
    }
  }

  onSave(): void {
    const formValue = this.mailUserForm.baseForm.value;
    if (this.actionTODO === Action.NEW) {
      this.userSvc.new(formValue).subscribe((res) => {
        console.log('New ', res);
        this.onClose(true);
        this.mailUserForm.onReset();
      }, (err) => {
        console.log('Error in create new mail user! :> ', err);
      });
    } else {
      const userId = this.data?.user?.id;
      this.userSvc.update(userId, formValue).subscribe((res) => {
        console.log('Update', res);
        this.onClose(true);
        this.mailUserForm.onReset();
      }, (err) => {
        console.log('Error in update mail user! :> ', err);
      });
    }
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.actionTODO = Action.EDIT;
      this.pathFormData();
    } else {
      this.actionTODO = Action.NEW;
    }

    this.subscripcion.add(
      this.userSvc.getAssociations().subscribe(associations => {
        if (associations) {
          this.associations = associations;
        }
      }, (err) => {
        console.log('Get associations error! :> ', err);
      })
    );

    this.subscripcion.add(
      this.userSvc.getAcademicPrograms().subscribe(programs => {
        if (programs) {
          this.programs = programs;
        }
      }, (err) => {
        console.log('Get program error! :> ', err);
      })
    );

    this.subscripcion.add(
      this.userSvc.getBondingTypes().subscribe(types => {
        if (types) {
          this.bondingTypes = types;
        }
      }, (err) => {
        console.log('Get bonding type error! :> ', err);
      })
    );

    this.subscripcion.add(
      this.userSvc.getPlatforms().subscribe(platforms => {
        if (platforms) {
          this.platforms = platforms;
        }
      }, (err) => {
        console.log('Get platforms error! :> ', err);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }

}

import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output,} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter,} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ByNameId, ProgramaAcademicoPorUsuarioCorreo,} from '@shared/models/mail-users.model';
import * as moment from 'moment';
import {Subscription} from 'rxjs';

import {EmailUsersService} from '../../../services/email-users.service';
import { BaseFormMailUsers } from '@pages/publisher/utils/base-form-mail-users';

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

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ModalMailUsersComponent implements OnInit, OnDestroy {
  @Output() refresh = new EventEmitter<boolean>(false);

  actionTODO = '';
  maxListsConfig = {
    associations: 4,
    program: 2,
    bodyType: 4,
    platforms: 4,
  };
  today = new Date();
  close = false;
  associations: ByNameId[];
  programs: ProgramaAcademicoPorUsuarioCorreo[];
  bondingTypes: ByNameId[];
  platforms: ByNameId[];
  private subscription: Subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userSvc: EmailUsersService,
    public mailUserForm: BaseFormMailUsers
  ) {
  }

  setBirthdayFormat(event: MatDatepickerInputEvent<Date>) {
    this.mailUserForm.baseForm.controls.fechaNacimiento.setValue(moment(event.value).format('YYYY-MM-DD'));
  }

  checkField(field: string, group?: string, iterator?: number): boolean {
    return this.mailUserForm.isValidField(field, group, iterator);
  }

  setFormGroupID(formGroup: FormGroup, id: number) {
    formGroup.controls.id.setValue(id);
  }

  setFormGroupCode(formGroup: FormGroup, code: number) {
    formGroup.controls.codigo.setValue(code);
  }

  addByNameFormGroup(formGroup: string): void {
    this.mailUserForm.addByNameFormGroup(formGroup);
  }

  removeOrClearByName(iterator: number, formGroup: string, onClose?: boolean): void {
    if (!onClose) {
      if (confirm('Seguro que desea remover la lista?')) {
        this.mailUserForm.removeOrClearByName(iterator, formGroup);
      }
    } else {
      this.mailUserForm.removeOrClearByName(iterator, formGroup);
    }
  }

  onShowAddAssociation(iterator: number): boolean {
    return (iterator === (this.getAssociationsSize() - 1) && (this.getAssociationsSize() < this.maxListsConfig.associations));
  }

  getAssociationsSize(): number {
    return this.mailUserForm.baseForm.controls.asociacionPorUsuarioCorreo.value.length;
  }

  onShowAddProgram(iterator: number): boolean {
    return (iterator === (this.getProgramsSize() - 1) && (this.getProgramsSize() < this.maxListsConfig.program));
  }

  getProgramsSize(): number {
    return this.mailUserForm.baseForm.controls.programaAcademicoPorUsuarioCorreo.value.length;
  }

  onShowAddBodyType(iterator: number): boolean {
    return (iterator === (this.getBodyTypesSize() - 1) && (this.getBodyTypesSize() < this.maxListsConfig.bodyType));
  }

  getBodyTypesSize(): number {
    return this.mailUserForm.baseForm.controls.vinculacionPorUsuarioCorreo.value.length;
  }

  getPlatformsSize(): number {
    return this.mailUserForm.baseForm.controls.plataformaPorUsuarioCorreo.value.length;
  }

  onShowPlatforms(iterator: number): boolean {
    return (iterator === (this.getPlatformsSize() - 1) && (this.getPlatformsSize() < this.maxListsConfig.platforms));
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.mailUserForm.onReset();
      const associations = this.mailUserForm.baseForm.controls.asociacionPorUsuarioCorreo.value;
      const bodyTypes = this.mailUserForm.baseForm.controls.vinculacionPorUsuarioCorreo.value;
      const programs = this.mailUserForm.baseForm.controls.programaAcademicoPorUsuarioCorreo.value;
      const platforms = this.mailUserForm.baseForm.controls.plataformaPorUsuarioCorreo.value;

      for (const association of associations) {
        this.removeOrClearByName(association, 'asociacionPorUsuarioCorreo', true);
      }
      for (const bodyType of bodyTypes) {
        this.removeOrClearByName(bodyType, 'vinculacionPorUsuarioCorreo', true);
      }
      for (const program of programs) {
        this.removeOrClearByName(program, 'programaAcademicoPorUsuarioCorreo', true);
      }
      for (const platform of platforms) {
        this.removeOrClearByName(platform, 'plataformaPorUsuarioCorreo', true);
      }
      this.refresh.emit(true);
      this.dialogRef.close();
    }
  }

  onSave(): void {
    const formValue = this.mailUserForm.baseForm.value;
    if (this.actionTODO === Action.new) {
      this.userSvc.new(formValue).subscribe((user) => {
        console.log('New mailUser', user);
        this.onClose(true);
        this.refresh.emit(true);
        this.mailUserForm.onReset();
      }, (err) => {
        console.error('Error in create new mail user! :> ', err);
      });
    } else {
      const userId = this.data?.user?.id;
      this.userSvc.update(userId, formValue).subscribe((user) => {
        console.log('Update mailuser:>', user);
        this.onClose(true);
        this.refresh.emit(true);
        this.mailUserForm.onReset();
      }, (err) => {
        console.error('Error in update mail user! :> ', err);
      });
    }
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.actionTODO = Action.edit;
      this.pathFormData();
    } else {
      this.actionTODO = Action.new;
    }

    this.subscription.add(
      this.userSvc.getAssociations().subscribe(associations => {
        if (associations) {
          this.associations = associations;
        }
      }, (err) => {
        console.log('Get associations error! :> ', err);
      })
    );

    this.subscription.add(
      this.userSvc.getAcademicPrograms().subscribe(programs => {
        if (programs) {
          this.programs = programs;
        }
      }, (err) => {
        console.error('Get program error! :> ', err);
      })
    );

    this.subscription.add(
      this.userSvc.getBondingTypes().subscribe(types => {
        if (types) {
          this.bondingTypes = types;
        }
      }, (err) => {
        console.error('Get bonding type error! :> ', err);
      })
    );

    this.subscription.add(
      this.userSvc.getPlatforms().subscribe(platforms => {
        if (platforms) {
          this.platforms = platforms;
        }
      }, (err) => {
        console.error('Get platforms error! :> ', err);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private pathFormData(): void {
    const associations = this.data?.user.asociacionPorUsuarioCorreo;
    const programs = this.data?.user.programaAcademicoPorUsuarioCorreo;
    const bonding = this.data?.user.vinculacionPorUsuarioCorreo;
    const platform = this.data?.user.plataformaPorUsuarioCorreo;

    if (associations) {
      for (let i = 0; i < associations.length - 1; i++) {
        this.mailUserForm.addByNameFormGroup('asociacionPorUsuarioCorreo');
      }
    }
    if (programs) {
      for (let i = 0; i < programs.length - 1; i++) {
        this.mailUserForm.addByNameFormGroup('programaAcademicoPorUsuarioCorreo');
      }
    }
    if (bonding) {
      for (let i = 0; i < bonding.length - 1; i++) {
        this.mailUserForm.addByNameFormGroup('vinculacionPorUsuarioCorreo');
      }
    }
    if (platform) {
      for (let i = 0; i < platform.length - 1; i++) {
        this.mailUserForm.addByNameFormGroup('plataformaPorUsuarioCorreo');
      }
    }
    this.mailUserForm.baseForm.patchValue(this.data?.user);

  }

}

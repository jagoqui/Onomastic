import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';
import { Subject } from 'rxjs';
import { LoaderService } from '@app/shared/services/loader.service';
import { ByNameId } from '@adminShared/models/shared.model';
import { PublisherService } from '@adminShared/services/publisher.service';
import { AssociationService } from '@adminShared/services/association.service';
import { BaseFormPublisher } from '@adminShared/utils/base-form-publisher';

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
export class ModalPublishersComponent implements OnInit {
  @Output() refresh = new EventEmitter<boolean>(false);
  actionTODO = Action.new;
  showPasswordField = true;
  hide = true;
  maxListsConfig = {
    associations: 4
  };
  associationsRes: ByNameId[];
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


  ngOnInit(): void {
    // if (this.data?.user.hasOwnProperty('id')) {
    //   this.actionTODO = Action.edit;
    // }
    // this.newPublisherForm.baseForm.get('password').setValidators(null);
    // this.newPublisherForm.baseForm.get('password').updateValueAndValidity();
    // this.newPublisherForm.baseForm.get('role').setValidators(null);
    // this.newPublisherForm.baseForm.get('role').updateValueAndValidity();
    if (this.data?.event) {
      this.actionTODO = Action.edit;
      this.pathFormData();
    } else {
      this.actionTODO = Action.new;
    }

    this.associationSvc.getAssociations()
      .subscribe(associations => {
        if (associations) {
          this.associationsRes = associations;
          // this.selectedIdFilterAssociation = new Array(this.conditionsRes.length + 1);
        }
      }, (err) => {
        console.log('Get condition error! :> ', err);
      });
  }


  addByNameFormGroup(formGroup: string): void {
    this.publisherForm.addByNameFormGroup(formGroup);
  }

  removeOrClearByName(iterator: number, formGroup: string, onClose?: boolean): void {
    if (!onClose) {
      if (confirm('Seguro que desea remover la lista?')) {
        this.publisherForm.removeOrClearByName(iterator, formGroup);
      }
    } else {
      this.publisherForm.removeOrClearByName(iterator, formGroup);
    }
  }

  getAssociationsSize(): number {
    return this.publisherForm.baseForm.controls.asociacionPorUsuarioCorreo.value.length;
  }

  setFormGroupID(formGroup: FormGroup, id: number) {
    formGroup.controls.id.setValue(id);
  }

  onShowAddAssociation(iterator: number): boolean {
    return (iterator === (this.getAssociationsSize() - 1) && (this.getAssociationsSize() < this.maxListsConfig.associations));
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.publisherForm.onReset();
      this.refresh.emit(true);
      this.dialogRef.close();
    }
  }

  onSave() {
    this.publisherSvc.new(this.publisherForm.baseForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event) {
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


  private pathFormData(): void {
    this.publisherForm.baseForm.patchValue(this.data?.event);
  }

}

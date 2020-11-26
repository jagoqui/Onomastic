import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  BaseFormPlatformUsers,
} from 'src/app/shared/utils/base-form-platform-users';

enum Action {
  EDIT = 'Actualizar',
  NEW = 'Agregar',
}

@Component({
  selector: 'app-modal-mail-users',
  templateUrl: './modal-mail-users.component.html',
  styleUrls: ['./modal-mail-users.component.scss']
})
export class ModalMailUsersComponent implements OnInit {
  actionTODO = Action.NEW;
  showPasswordField = true;
  close = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private autSvc: AuthService,
    public mailUserForm: BaseFormPlatformUsers
  ) { }

  checkField(field: string): boolean {
    return this.mailUserForm.isValidField(field);
  }

  handleKeyDown(event: any) {
    if (event.keyCode === 'Enter') {
      this.onSave();
      event.default();
    }
  }

  onSave(): void {
    this.close = true;
  }

  ngOnInit(): void {
    if (this.data?.user.hasOwnProperty('id')) {
      this.actionTODO = Action.EDIT;
    }
  }

}

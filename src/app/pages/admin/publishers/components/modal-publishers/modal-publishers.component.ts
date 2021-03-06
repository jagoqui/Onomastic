import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthService} from '@auth/services/auth.service';
import {BaseFormPlatformUsers} from '@shared/utils/base-form-platform-users';

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

  actionTODO = Action.new;
  showPasswordField = true;
  hide = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private autSvc: AuthService,
    public newPublisherForm: BaseFormPlatformUsers
  ) {
  }

  ngOnInit(): void {
    if (this.data?.user.hasOwnProperty('id')) {
      this.actionTODO = Action.edit;
    }
    this.newPublisherForm.baseForm.get('password').setValidators(null);
    this.newPublisherForm.baseForm.get('password').updateValueAndValidity();
    this.newPublisherForm.baseForm.get('role').setValidators(null);
    this.newPublisherForm.baseForm.get('role').updateValueAndValidity();
  }


}

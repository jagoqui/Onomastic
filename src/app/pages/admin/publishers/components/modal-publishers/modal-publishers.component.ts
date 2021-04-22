import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormPublishers } from '@publishers/utils/base-form-publishers';

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
    public newPublishersForm: BaseFormPublishers
  ) {
  }

  ngOnInit(): void {
    if (this.data?.user.hasOwnProperty('id')) {
      this.actionTODO = Action.edit;
    }
    this.newPublishersForm.baseForm.get('password').setValidators(null);
    this.newPublishersForm.baseForm.get('password').updateValueAndValidity();
    this.newPublishersForm.baseForm.get('role').setValidators(null);
    this.newPublishersForm.baseForm.get('role').updateValueAndValidity();
  }


}

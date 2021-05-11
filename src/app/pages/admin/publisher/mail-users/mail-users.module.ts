import { NgModule } from '@angular/core';

import { ModalMailUsersComponent } from './components/modal-mail-users/modal-mail-users.component';
import { MailUsersRoutingModule } from './mail-users-routing.module';
import { MailUsersComponent } from './mail-users.component';
import { SharedModule } from '@appShared/shared.module';
import { ModalMailsLogComponent } from './components/modal-mails-log/modal-mails-log.component';


@NgModule({
  declarations: [MailUsersComponent, ModalMailUsersComponent, ModalMailsLogComponent],
  imports: [
    MailUsersRoutingModule,
    SharedModule
  ]
})
export class MailUsersModule {
}

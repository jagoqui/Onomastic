import { NgModule } from '@angular/core';

import { ModalMailUsersComponent } from './components/modal-mail-users/modal-mail-users.component';
import { MailUsersRoutingModule } from './mail-users-routing.module';
import { MailUsersComponent } from './mail-users.component';
import { SharedModule } from '@appShared/shared.module';


@NgModule({
  declarations: [MailUsersComponent, ModalMailUsersComponent],
  imports: [
    MailUsersRoutingModule,
    SharedModule
  ]
})
export class MailUsersModule {
}

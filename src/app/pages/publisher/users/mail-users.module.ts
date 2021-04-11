import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';

import {ModalMailUsersComponent,} from './components/modal-mail-users/modal-mail-users.component';
import {MailUsersRoutingModule} from './mail-users-routing.module';
import {MailUsersComponent} from './mail-users.component';


@NgModule({
  declarations: [MailUsersComponent, ModalMailUsersComponent],
  imports: [
    MailUsersRoutingModule,
    SharedModule
  ]
})
export class MailUsersModule {
}

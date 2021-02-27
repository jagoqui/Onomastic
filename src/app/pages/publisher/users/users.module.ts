import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';

import {ModalMailUsersComponent,} from './components/modal-mail-users/modal-mail-users.component';
import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';


@NgModule({
  declarations: [UsersComponent, ModalMailUsersComponent],
  imports: [
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule {
}

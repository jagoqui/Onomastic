import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ModalMailUsersComponent } from './components/modal-mail-users/modal-mail-users.component';


@NgModule({
  declarations: [UsersComponent, ModalMailUsersComponent],
  imports: [
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }

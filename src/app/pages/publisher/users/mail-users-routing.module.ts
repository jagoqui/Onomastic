import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MailUsersComponent} from './mail-users.component';

const routes: Routes = [{path: '', component: MailUsersComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailUsersRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmationEmailComponent } from './confirmation-email.component';

const routes: Routes = [{ path: '', component: ConfirmationEmailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmationEmailRoutingModule { }

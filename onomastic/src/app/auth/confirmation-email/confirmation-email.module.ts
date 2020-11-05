import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationEmailRoutingModule } from './confirmation-email-routing.module';
import { ConfirmationEmailComponent } from './confirmation-email.component';


@NgModule({
  declarations: [ConfirmationEmailComponent],
  imports: [
    CommonModule,
    ConfirmationEmailRoutingModule
  ]
})
export class ConfirmationEmailModule { }

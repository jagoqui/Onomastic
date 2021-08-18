import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MaterialModule} from 'src/app/material-module.module';

import {AdminRoutingModule} from './admin-routing.module';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@auth/reset-password/reset-password.component';


@NgModule({
  declarations: [ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
  ]
})
export class AdminModule {
}

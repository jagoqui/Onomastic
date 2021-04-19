import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';

import { MaterialModule } from '../material-module.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import {
  MailUsersSubscriptionStatusComponent,
} from './components/mail-users-subscription-status/mail-users-subscription-status.component';
import {
  OnomasticLogoComponent,
} from './components/onomastic-logo/onomastic-logo.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {
  MaterialElevationDirective,
} from './directives/material-elevation.directive';

@NgModule({
  declarations: [
    OnomasticLogoComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MailUsersSubscriptionStatusComponent,
    MaterialElevationDirective
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule
  ],
  exports: [
    CommonModule,
    OnomasticLogoComponent,
    HeaderComponent,
    MailUsersSubscriptionStatusComponent,
    SidebarComponent,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    FooterComponent,
    MaterialElevationDirective,
  ]
})
export class SharedModule { }

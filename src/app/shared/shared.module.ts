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
  OnomasticLogoComponent,
} from './components/onomastic-logo/onomastic-logo.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    OnomasticLogoComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
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
    SidebarComponent,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    FooterComponent
  ]
})
export class SharedModule { }

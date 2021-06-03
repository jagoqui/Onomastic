import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxCaptchaModule} from 'ngx-captcha';

import {MaterialModule} from '../material-module.module';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {
  MailUsersSubscriptionStatusComponent,
} from './components/mail-users-subscription-status/mail-users-subscription-status.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {
  MaterialElevationDirective,
} from './directives/material-elevation.directive';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgSelectModule} from '@ng-select/ng-select';
import {ScrollComponent} from './components/scroll/scroll.component';

import {LottieModule} from 'ngx-lottie';


export const playerFactory = () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');

const imports = [
  CommonModule,
  FlexLayoutModule,
  RouterModule,
  MaterialModule,
  FormsModule,
  ReactiveFormsModule,
  NgxCaptchaModule,
  NgxSpinnerModule,
  NgSelectModule,
  LottieModule.forRoot({player: playerFactory})
];
export default imports;

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MailUsersSubscriptionStatusComponent,
    MaterialElevationDirective,
    ScrollComponent
  ],
  imports: [
    imports
  ],
  exports: [
    imports,
    HeaderComponent,
    MailUsersSubscriptionStatusComponent,
    SidebarComponent,
    FooterComponent,
    MaterialElevationDirective,
    ScrollComponent
  ]
})
export class SharedModule {
}

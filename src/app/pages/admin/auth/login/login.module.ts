import {NgModule} from '@angular/core';
import {NgxSpinnerModule} from 'ngx-spinner';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {SharedModule} from '@appShared/shared.module';
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [LoginComponent],
  imports: [
    LoginRoutingModule,
    NgxSpinnerModule,
    SharedModule
  ]
})
export class LoginModule {
}

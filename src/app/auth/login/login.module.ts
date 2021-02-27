import {NgModule} from '@angular/core';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SharedModule} from 'src/app/shared/shared.module';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';


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

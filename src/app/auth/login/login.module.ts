import {NgModule} from '@angular/core';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SharedModule} from 'src/app/shared/shared.module';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [LoginComponent],
  providers:[
    FormControl
  ],
  imports: [
    LoginRoutingModule,
    NgxSpinnerModule,
    SharedModule
  ]
})
export class LoginModule {
}

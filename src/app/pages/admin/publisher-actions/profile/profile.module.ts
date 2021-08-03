import {NgModule} from '@angular/core';

import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './profile.component';
import { SharedModule } from '@appShared/shared.module';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule {
}

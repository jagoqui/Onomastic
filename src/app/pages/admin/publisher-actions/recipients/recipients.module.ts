import { NgModule } from '@angular/core';

import { ModalRecipientsComponent } from './components/modal-recipients/modal-recipients.component';
import { RecipientsRoutingModule } from './recipients-routing.module';
import { RecipientsComponent } from './recipients.component';
import { SharedModule } from '@appShared/shared.module';
import { ModalRecipientsLogComponent } from './components/modal-recipients-log/modal-recipients-log.component';


@NgModule({
  declarations: [RecipientsComponent, ModalRecipientsComponent, ModalRecipientsLogComponent],
  imports: [
    RecipientsRoutingModule,
    SharedModule
  ]
})
export class RecipientsModule {
}

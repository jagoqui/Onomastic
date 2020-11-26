import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import {
  ModalPublishersComponent,
} from './components/modal-publishers/modal-publishers.component';
import { PublishersRoutingModule } from './publishers-routing.module';
import { PublishersComponent } from './publishers.component';


@NgModule({
  declarations: [PublishersComponent, ModalPublishersComponent],
  imports: [
    PublishersRoutingModule,
    SharedModule
  ]
})
export class PublishersModule { }

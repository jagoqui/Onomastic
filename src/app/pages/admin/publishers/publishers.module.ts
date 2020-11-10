import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishersRoutingModule } from './publishers-routing.module';
import { PublishersComponent } from './publishers.component';


@NgModule({
  declarations: [PublishersComponent],
  imports: [
    CommonModule,
    PublishersRoutingModule
  ]
})
export class PublishersModule { }

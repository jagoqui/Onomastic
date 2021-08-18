import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PublisherRoutingModule } from './publisher-routing.module';
import { MaterialModule } from '@app/material-module.module';

@NgModule({
  imports: [
    CommonModule,
    PublisherRoutingModule,
    MaterialModule
  ]
})
export class PublisherModule {
}

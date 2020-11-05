import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material-module.module';

import { PublisherRoutingModule } from './publisher-routing.module';
import { PublisherComponent } from './publisher.component';


@NgModule({
  declarations: [PublisherComponent],
  imports: [
    CommonModule,
    PublisherRoutingModule,
    MaterialModule
  ]
})
export class PublisherModule { }

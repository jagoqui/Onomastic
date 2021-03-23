import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {PublisherRoutingModule} from './publisher-routing.module';
import {PublisherComponent} from './publisher.component';
import { TemplateCardComponent } from './components/template-card/template-card.component';
import { MaterialModule } from '@app/material-module.module';


@NgModule({
  declarations: [PublisherComponent, TemplateCardComponent],
  exports: [
    TemplateCardComponent
  ],
  imports: [
    CommonModule,
    PublisherRoutingModule,
    MaterialModule
  ]
})
export class PublisherModule {
}

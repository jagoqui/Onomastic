import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateCardComponent } from '@publisher/templates-cards/components/template-card/template-card.component';
import { SharedModule } from '@appShared/shared.module';


@NgModule({
  declarations: [TemplateCardComponent],
  exports: [
    TemplateCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TemplateCardModule {
}

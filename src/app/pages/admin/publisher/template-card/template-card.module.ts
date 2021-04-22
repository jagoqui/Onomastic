import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateCardComponent } from '@pages/admin/publisher/template-card/template-card.component';
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

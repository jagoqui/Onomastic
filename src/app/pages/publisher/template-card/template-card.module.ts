import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateCardComponent } from '@pages/publisher/template-card/template-card.component';
import { MaterialModule } from '@app/material-module.module';
import { SharedModule } from '@shared/shared.module';



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
export class TemplateCardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateCardComponent } from '@pages/publisher/template-card/template-card.component';
import { MaterialModule } from '@app/material-module.module';



@NgModule({
  declarations: [TemplateCardComponent],
  exports: [
    TemplateCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class TemplateCardModule { }

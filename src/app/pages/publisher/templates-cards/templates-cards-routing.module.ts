import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TemplatesCardsComponent} from './templates-cards.component';

const routes: Routes = [{path: '', component: TemplatesCardsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesCardsRoutingModule {
}

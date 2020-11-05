import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishersComponent } from './publishers.component';

const routes: Routes = [{ path: '', component: PublishersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishersRoutingModule { }

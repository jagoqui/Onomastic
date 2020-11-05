import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPublisherComponent } from './add-publisher.component';

const routes: Routes = [{ path: '', component: AddPublisherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPublisherRoutingModule { }

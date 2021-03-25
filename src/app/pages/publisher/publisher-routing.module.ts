import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PublisherComponent} from './publisher.component';

const routes: Routes = [
  {path: '', component: PublisherComponent},
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'templates-cards',
    redirectTo:'templates-cards/'
  },
  {
    path: 'templates-cards/:id',
    loadChildren: () => import('./templates-cards/templates-cards.module').then(m => m.TemplatesCardsModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpModule)
  },
  {
    path: 'events-day',
    loadChildren: () => import('./events-day/events-day.module').then(m => m.EventsDayModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublisherRoutingModule {
}

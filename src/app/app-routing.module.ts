import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';

import {
  PageNotFoundComponent,
} from './shared/components/page-not-found/page-not-found.component';
import { CheckLoginGuard } from './shared/guards/check-login.guard';
import {
  NegateCheckLoginGuard,
} from './shared/guards/negate-check-login.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'ADMIN',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule),
    canActivate: [NegateCheckLoginGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./auth/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'add-publisher',
    loadChildren: () => import('./auth/add-publisher/add-publisher.module').then(m => m.AddPublisherModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'confirmation-email',
    loadChildren: () => import('./auth/confirmation-email/confirmation-email.module').then(m => m.ConfirmationEmailModule),
  },
  {
    path: 'PUBLISHER',
    loadChildren: () => import('./pages/publisher/publisher.module').then(m => m.PublisherModule)
  },
  {
    path: 'forgot-password', loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canActivate: [NegateCheckLoginGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true,
    preloadingStrategy: QuicklinkStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

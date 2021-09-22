import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuicklinkStrategy} from 'ngx-quicklink';
import {NegateCheckLoginGuard} from '@appShared/guards/negate-check-login.guard';

import {RecipientSubscriptionStatusComponent}
  from '@appShared/components/recipient-subscription-status/recipient-subscription-status.component';
import {CheckLoginGuard} from '@appShared/guards/check-login.guard';
import {PageNotFoundComponent} from '@appShared/components/page-not-found/page-not-found.component';
import {ForgotPasswordComponent} from '@auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from '@auth/reset-password/reset-password.component';
import {LoveMailStatusComponent} from "@appShared/components/love-mail-status/love-mail-status.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/admin/auth/login/login.module').then(m => m.LoginModule),
    canActivate: [NegateCheckLoginGuard]
  },
  {
    path: 'mail-users-subscription-status/:email',
    component: RecipientSubscriptionStatusComponent
  },
  {
    path: 'love-mail-status/:email/:event_id',
    component: LoveMailStatusComponent
  },
  {
    path: 'ADMIN',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/admin/publisher-actions/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'reset/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'PUBLISHER',
    loadChildren: () => import('./pages/admin/publisher-actions/publisher.module').then(m => m.PublisherModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NegateCheckLoginGuard]
  }, {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      enableTracing: true,
      preloadingStrategy: QuicklinkStrategy,
      useHash: true
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

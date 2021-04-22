import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { NegateCheckLoginGuard } from '@appShared/guards/negate-check-login.guard';
// eslint-disable-next-line max-len
import { MailUsersSubscriptionStatusComponent } from '@appShared/components/mail-users-subscription-status/mail-users-subscription-status.component';
import { CheckLoginGuard } from '@appShared/guards/check-login.guard';
import { PageNotFoundComponent } from '@appShared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/admin/auth/login/login.module').then(m => m.LoginModule),
    // redirectTo: 'PUBLISHER/templates-cards/',
    canActivate: [NegateCheckLoginGuard]
  },
  {
    path: 'mail-users-subscription-status/:email',
    component: MailUsersSubscriptionStatusComponent
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
    path: 'profile',
    loadChildren: () => import('./pages/admin/auth/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'add-publisher',
    loadChildren: () => import('./pages/admin/auth/add-publisher/add-publisher.module').then(m => m.AddPublisherModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'confirmation-email',
    loadChildren: () => import('./pages/admin/auth/confirmation-email/confirmation-email.module').then(m => m.ConfirmationEmailModule)
  },
  {
    path: 'PUBLISHER',
    loadChildren: () => import('./pages/admin/publisher/publisher.module').then(m => m.PublisherModule),
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/admin/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@shared/components/page-not-found/page-not-found.component';
import { CheckLoginGuard } from '@shared/guards/check-login.guard';
import { NegateCheckLoginGuard } from '@shared/guards/negate-check-login.guard';
import { QuicklinkStrategy } from 'ngx-quicklink';

import { MailUsersSubscriptionStatusComponent } from '@shared/components/mail-users-subscription-status/mail-users-subscription-status.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule),
    // redirectTo: 'PUBLISHER/templates-cards/',
    canActivate: [NegateCheckLoginGuard]
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
    loadChildren: () => import('./auth/confirmation-email/confirmation-email.module').then(m => m.ConfirmationEmailModule)
  },
  {
    path: 'PUBLISHER',
    loadChildren: () => import('./pages/publisher/publisher.module').then(m => m.PublisherModule)
    // canActivate: [CheckLoginGuard]
  },
  {
    path: 'forgot-password', loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canActivate: [NegateCheckLoginGuard]
  },
  {
    /*TODO: Permitir acceso de forma pública.*/
    path: 'mail-mail-users-subscription-status/:email',
    component: MailUsersSubscriptionStatusComponent
  },
  {
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

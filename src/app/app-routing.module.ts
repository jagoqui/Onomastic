import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '***',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./auth/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'add-publisher',
    loadChildren: () => import('./auth/add-publisher/add-publisher.module').then(m => m.AddPublisherModule)
  },
  {
    path: 'confirmation-email',
    loadChildren: () => import('./auth/confirmation-email/confirmation-email.module').then(m => m.ConfirmationEmailModule)
  },
  {
    path: 'publisher',
    loadChildren: () => import('./pages/publisher/publisher.module').then(m => m.PublisherModule)
  },
  { path: 'forgot-password', loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

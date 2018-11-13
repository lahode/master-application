import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CallbackComponent } from './auth/components/callback/callback.component';
import { PageNotFoundComponent } from './global/components/page-not-found/page-not-found.component';

import { AuthGuard } from './auth/services/authguard.service';
import { NoGuard } from './auth/services/noguard.service';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [NoGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signin',
    component: LoginComponent,
    canActivate: [NoGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

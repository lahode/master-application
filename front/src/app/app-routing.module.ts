import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CallbackComponent } from './auth/components/callback/callback.component';
import { ManageUsersComponent } from './user/components/manage-users/manage-users.component';
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
    canActivate: [NoGuard]
  },
  {
    path: 'callback',
    component: CallbackComponent,
    canActivate: [NoGuard]
  },
  {
    path: 'users',
    component: ManageUsersComponent,
    canActivate: [AuthGuard],
    data: {
       perms: ['manage users']
    }
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

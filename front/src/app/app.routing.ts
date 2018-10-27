import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { ManageUsersComponent } from './user/components/manage-users/manage-users.component';
import { PageNotFoundComponent } from './global/components/page-not-found/page-not-found.component';

import { AuthGuard } from './auth/services/authguard.service';
import { NoGuard } from './auth/services/noguard.service';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signin',
    component: LoginComponent,
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

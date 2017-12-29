import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/components/login/login.component';
import { ManageUsersComponent } from './user/components/manage-users/manage-users.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/services/authguard.service';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: LoginComponent },
  { path: 'users', component: ManageUsersComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

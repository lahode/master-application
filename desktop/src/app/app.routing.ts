import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../core/services/auth-service/authguard.service';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'toto', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: LoginComponent },

  { path: '**', redirectTo: '' }
];

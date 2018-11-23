import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/services/authguard.service';

import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';

export const routes: Routes = [
  { path: '', children: [
    {
      path: '',
      component: ViewProfileComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'edit',
      component: EditProfileComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'manage',
      component: ManageUsersComponent,
      canActivate: [AuthGuard],
      data: {
         perms: ['manage users']
      }
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

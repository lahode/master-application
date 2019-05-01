import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/services/authguard.service';

import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';

export const routes: Routes = [
  { path: '', children: [
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

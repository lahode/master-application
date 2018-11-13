import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';

export const routes: Routes = [
  { path: '', children: [
    {
      path: '',
      component: ViewProfileComponent
    },
    {
      path: 'edit',
      component: EditProfileComponent,
    },
    {
      path: 'manage',
      component: ManageUsersComponent,
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

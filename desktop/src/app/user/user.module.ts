/* Contrib modules */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule, MatCheckboxModule, MatButtonModule,
         MatTabsModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Custom modules */
import { UserStoreModule } from './store';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { UsersEditComponent } from './components/users-edit/users-edit.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { RolesListComponent } from './components/roles-list/roles-list.component';
import { RolesEditComponent } from './components/roles-edit/roles-edit.component';

@NgModule({
  declarations: [
    ManageUsersComponent,
    UsersEditComponent,
    UsersListComponent,
    RolesListComponent,
    RolesEditComponent
  ],
  imports: [
    SharedModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    UserStoreModule.forRoot()
  ],
  entryComponents: [
    UsersEditComponent,
    RolesEditComponent
  ]
})
export class UserModule {}
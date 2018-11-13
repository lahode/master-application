/* Contrib modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '../global/global.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule, MatTabsModule, MatButtonModule, MatSelectModule,
         MatGridListModule, MatPaginatorModule, MatPaginatorIntl } from '@angular/material';

/* Custom modules */
import { UserStoreModule } from './store';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { RolesListComponent } from './components/roles-list/roles-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { UserRoutingModule } from './user-routing.module';

export class MatPaginatorIntApp extends MatPaginatorIntl {
  itemsPerPageLabel = 'PAGER_ITEMPERPAGE';
  nextPageLabel     = 'PAGER_NEXTPAGE';
  previousPageLabel = 'PAGER_PREVIOUSPAGE';
}

@NgModule({
  declarations: [
    EditProfileComponent,
    ManageUsersComponent,
    RolesListComponent,
    UsersListComponent,
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    MatButtonModule,
    MatGridListModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    UserRoutingModule,
    UserStoreModule.forRoot()
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntApp}]
})
export class UserModule {}

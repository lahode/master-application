/* Contrib modules */
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

/* Custom modules */
import { GlobalModule } from '../global/global.module';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { RolesListComponent } from './components/roles-list/roles-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
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
    UsersListComponent
  ],
  imports: [
    GlobalModule,
    CdkTableModule,
    MatGridListModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    UserRoutingModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntApp}]
})
export class UserModule {}

/* Contrib modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '../global/global.module';
import { TranslateModule } from '@ngx-translate/core';

import { CdkTableModule } from '@angular/cdk/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

/* Custom modules */
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
    CdkTableModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    UserRoutingModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntApp}]
})
export class UserModule {}

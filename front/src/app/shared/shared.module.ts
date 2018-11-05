import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatInputModule, MatCheckboxModule, MatButtonModule } from '@angular/material';

import { RolesEditComponent } from './components/roles-edit/roles-edit.component';
import { UsersEditComponent } from './components/users-edit/users-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  declarations: [
    RolesEditComponent,
    UsersEditComponent
  ],
  entryComponents: [
    RolesEditComponent,
    UsersEditComponent
  ]
})
export class SharedModule {}

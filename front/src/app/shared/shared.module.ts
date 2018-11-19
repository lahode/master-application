import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { PictureEditComponent } from './components/picture-edit/picture-edit.component';
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
    MatDialogModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  declarations: [
    PictureEditComponent,
    RolesEditComponent,
    UsersEditComponent
  ],
  entryComponents: [
    PictureEditComponent,
    RolesEditComponent,
    UsersEditComponent
  ]
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

/* Custom modules */
import { GlobalModule } from '../global/global.module';
import { PictureEditComponent } from './components/picture-edit/picture-edit.component';
import { RolesEditComponent } from './components/roles-edit/roles-edit.component';
import { UsersEditComponent } from './components/users-edit/users-edit.component';

@NgModule({

  imports: [
    GlobalModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [
    GlobalModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule
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

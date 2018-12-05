import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/* Custom modules */
import { GlobalModule } from '../global/global.module';
import { PictureEditComponent } from './components/picture-edit/picture-edit.component';
import { RolesEditComponent } from './components/roles-edit/roles-edit.component';
import { UsersEditComponent } from './components/users-edit/users-edit.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';

@NgModule({

  imports: [
    GlobalModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatSlideToggleModule,
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
    UsersEditComponent,
    ViewProfileComponent
  ],
  entryComponents: [
    PictureEditComponent,
    RolesEditComponent,
    UsersEditComponent,
    ViewProfileComponent
  ]
})
export class SharedModule {}

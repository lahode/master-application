import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule, MatNativeDateModule, DateAdapter } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/* Format de la date  */
import { DateFormat } from './date-format';

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
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  exports: [
    GlobalModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatNativeDateModule,
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
  ],
  providers: [
    { provide: DateAdapter, useClass: DateFormat }
  ]
})
export class SharedModule {
  constructor(private dateAdapter: DateAdapter<any>) {
    this.dateAdapter.setLocale('fr-FR'); // DD/MM/YYYY
  }
}

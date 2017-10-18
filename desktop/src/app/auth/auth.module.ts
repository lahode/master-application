/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   18-10-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 18-10-2017
 */

/* Contrib modules */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule, MatCheckboxModule, MatButtonModule, MatTabsModule, MatProgressSpinnerModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Custom modules */
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { PasswordComponent } from './password/password.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import { AuthStoreModule } from './store';

@NgModule({
  declarations: [
    LoginComponent,
    SigninComponent,
    RegisterComponent,
    PasswordComponent,
    ConfirmationComponent
  ],
  imports: [
    SharedModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AuthStoreModule.forRoot()
  ],
})
export class AuthModule {}

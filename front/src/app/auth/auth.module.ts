/* Contrib modules */
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

/* Custom modules */
import { AuthStoreModule } from './store';
import { GlobalModule } from '../global/global.module';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordRecoverComponent } from './components/password-recover/password-recover.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { CallbackComponent } from './components/callback/callback.component';
import { PermissionCheckDirective } from './directives/permission-check.directive';


/* Services */
import { AuthGuard } from './services/authguard.service';
import { NoGuard } from './services/noguard.service';

@NgModule({
  declarations: [
    LoginComponent,
    SigninComponent,
    RegisterComponent,
    PasswordRecoverComponent,
    PasswordResetComponent,
    ConfirmationComponent,
    CallbackComponent,
    PermissionCheckDirective
  ],
  exports: [
    PermissionCheckDirective
  ],
  imports: [
    GlobalModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AuthStoreModule.forRoot()
  ],
  providers: [
    AuthGuard,
    NoGuard,
  ]
})
export class AuthModule {}

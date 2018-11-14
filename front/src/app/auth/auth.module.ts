/* Contrib modules */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '../global/global.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule, MatCheckboxModule, MatButtonModule,
         MatTabsModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Custom modules */
import { AuthStoreModule } from './store';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordRecoverComponent } from './components/password-recover/password-recover.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { CallbackComponent } from './components/callback/callback.component';

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
    CallbackComponent
  ],
  imports: [
    GlobalModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AuthStoreModule.forRoot()
  ],
  providers: [
    AuthGuard,
    NoGuard,
  ]
})
export class AuthModule {}

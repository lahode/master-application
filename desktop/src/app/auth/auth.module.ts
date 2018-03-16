/* Contrib modules */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule, MatCheckboxModule, MatButtonModule,
         MatTabsModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Custom modules */
import { AuthStoreModule } from './store';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordComponent } from './components/password/password.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

/* Services */
import { AuthGuard } from './services/authguard.service';
import { NoGuard } from './services/noguard.service';
import { TokenInterceptor } from './services/auth_token.service';

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
    /*
    {
       provide: HTTP_INTERCEPTORS,
       useClass: TokenInterceptor,
       multi: true
    }
    */
  ]
})
export class AuthModule {}

/* Contrib modules */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

/* Custom modules */
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { PasswordComponent } from './password/password.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

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
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
  ],
})
export class AuthModule {}

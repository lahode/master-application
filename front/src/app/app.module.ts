/* Contrib modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { MatDialogModule, } from '@angular/material';
import { NgProgressModule } from '@ngx-progressbar/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/* Custom modules */
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';
import { UserModule } from './user/user.module';

/* Routing */
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

/* Store */
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppStoreModule } from '../core/store';

/* Providers */
import { TokenInterceptor } from './auth/services/auth_token.service';

/**
 * Custom Http Loader for translation
 * (AoT requires an exported function for factories)
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    NgProgressModule.forRoot(),
    MatDialogModule,
    BrowserAnimationsModule,
    AuthModule,
    GlobalModule,
    UserModule,
    AppStoreModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: false }),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

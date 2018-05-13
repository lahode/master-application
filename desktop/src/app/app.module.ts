/* Contrib modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HttpClient } from '@angular/common/http';
import { MatDialogModule, } from '@angular/material';
import { NgProgressModule } from 'ngx-progressbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppStoreModule } from '../core/store';

/**
 * Custom Http Loader for translation
 * (AoT requires an exported function for factories)
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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
    HttpClientXsrfModule.withOptions({ // Add cookie secure option
      cookieName: 'XSRF-TOKEN',
      headerName: 'x-xsrf-token'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgProgressModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AuthModule,
    GlobalModule,
    UserModule,
    AppStoreModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: false }),
    StoreDevtoolsModule.instrument(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

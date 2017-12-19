/* Contrib modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectModule, MatButtonModule, MatDialogModule,
         MatToolbarModule, MatMenuModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Custom modules */
import { AuthModule } from './auth/auth.module';

/* Routing */
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';

/* Components */
import { AppComponent, AppErrorComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MessageComponent } from './message/message.component';
import { LoadingComponent } from './loading/loading.component';

/* Services */
import { LocalDataStorageService } from './shared/localdata-storage.service';
import { MessageService } from './message/message.service';

/* Store */
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { AppStoreModule } from '../core/store';

/**
 * Custom Http Loader for translation
 * (AoT requires an exported function for factories)
 */
export function HttpOBLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AppErrorComponent,
    HeaderComponent,
    HomeComponent,
    MessageComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpOBLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    BrowserAnimationsModule,
    AuthModule,
    AppStoreModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: false }),
    StoreDevtoolsModule.instrument(),
  ],
  entryComponents: [
    AppErrorComponent
  ],
  providers: [
    LocalDataStorageService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

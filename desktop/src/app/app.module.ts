/* Contrib modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/* Custom modules */
import { AuthModule } from './auth/auth.module';
import { AppStateModule } from '../core/app-state-module';

/* Routing */
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';

/* Components */
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MessageComponent } from './message/message.component';
import { LoadingComponent } from './loading/loading.component';

/* Services */
import { LocalDataStorageService } from './shared/localdata-storage.service';
import { MessageService } from './message/message.service';

/* Store */
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
// import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { CoreModule, coreApp } from '../core';

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
    HeaderComponent,
    HomeComponent,
    MessageComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpOBLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AuthModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    StoreModule.forRoot({ counter: coreApp.reducer }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([coreApp.effect]),
    CoreModule.forRoot()
  ],
  providers: [
    LocalDataStorageService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthService } from '../services/auth-service/auth.service';
import { AuthGuard } from '../services/auth-service/authguard.service';
import { AuthEffects } from './effects/auth.effects';
import { reducer } from './reducers';
import { AuthActions } from './actions/auth.actions';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { JwtHelper, AuthHttp, AuthConfig } from 'angular2-jwt';
import { EndpointsService } from '../services/endpoints';
import { StorageService } from '../services/storage-service/storage.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  const authConfig = new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => StorageService.getItem('jwt')),
  });
  return new AuthHttp(authConfig, http, options);
}

export const providers = [
  AuthService,
  EndpointsService,
  StorageService,
  AuthActions,
  AuthGuard,
  JwtHelper,
  AuthHttp,
  {
    provide: AuthHttp,
    useFactory: authHttpServiceFactory,
    deps: [Http, RequestOptions]
  }
]

@NgModule({
  imports: [
    StoreModule.forRoot(reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class AppStateModule {}

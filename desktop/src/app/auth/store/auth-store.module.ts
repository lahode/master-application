import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { Http, RequestOptions } from '@angular/http';
import { JwtHelper, AuthHttp, AuthConfig } from 'angular2-jwt';

import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/authguard.service';
import { NoGuard } from '../services/noguard.service';
import { AuthEffects } from './effects/auth.effects';

import { reducers } from './reducers';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  const authConfig = new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => StorageService.getItem('jwt')),
  });
  return new AuthHttp(authConfig, http, options);
}

export const AuthProviders = [
  AuthService,
  AuthGuard,
  NoGuard,
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
    StoreModule.forFeature('authCheck', reducers.authCheck),
    StoreModule.forFeature('permissionCheck', reducers.permissionCheck),
    StoreModule.forFeature('currentUser', reducers.currentUser),
    EffectsModule.forFeature([AuthEffects]),
  ],
  exports: [
    StoreModule,
    EffectsModule
  ],
  providers: [AuthProviders]
})
export class AuthStoreModule {
  static forRoot() {
    return {
      ngModule: AuthStoreModule,
      providers: [AuthProviders]
    };
  }
}

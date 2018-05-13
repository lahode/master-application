import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { EndpointsService } from '../../../core/services/endpoints';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../../environments/environment';

import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';
import { AuthService } from '../services/auth.service';
import { AuthCookieService } from '../services/auth_cookie.service';
import { AuthOAuth2Service } from '../services/auth_oauth2.service';
import { AuthTokenService } from '../services/auth_token.service';
import { AuthEffects } from './effects/auth.effects';

import { reducers } from './reducers';

// Load dynamically the type of authentication
const authServiceFactory = (http: HttpClient,
                            endpoints: EndpointsService,
                            storage: StorageService,
                            jwtHelper: JwtHelper,
                            error: ErrorHandlerService) => {
  switch (environment.authentication.type) {
    case 'cookie':
      return new AuthCookieService(http, endpoints, storage, jwtHelper, error);
    case 'oauth2':
      return new AuthOAuth2Service(http, endpoints, storage, jwtHelper, error);
    default:
      return new AuthTokenService(http, endpoints, storage, jwtHelper, error);
  }
};

export let AuthServiceProvider = {
  provide: AuthService,
  useFactory: authServiceFactory,
  deps: [HttpClient, EndpointsService, StorageService, JwtHelper, ErrorHandlerService]
};

export const AuthProviders = [
  AuthServiceProvider,
  AuthTokenService,
  JwtHelper
];

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

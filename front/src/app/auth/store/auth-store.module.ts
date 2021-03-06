import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { EndpointsService } from '../../../core/services/endpoints';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';
import { AuthService } from '../services/auth.service';
import { AuthAuth0Service } from '../services/auth_auth0.service';
import { AuthTokenService } from '../services/auth_token.service';
import { AuthEffects } from './effects/auth.effects';

import { reducers } from './reducers';

// Load dynamically the type of authentication
const authServiceFactory = (http: HttpClient,
                            endpoints: EndpointsService,
                            storage: StorageService,
                            jwtHelper: JwtHelperService,
                            error: ErrorHandlerService) => {
  switch (environment.authentication.type) {
    case 'auth0':
      return new AuthAuth0Service(http, endpoints, storage, jwtHelper, error);
    default:
      return new AuthTokenService(http, endpoints, storage, jwtHelper, error);
  }
};

export let AuthServiceProvider = {
  provide: AuthService,
  useFactory: authServiceFactory,
  deps: [HttpClient, EndpointsService, StorageService, JwtHelperService, ErrorHandlerService]
};

export const AuthProviders = [
  AuthServiceProvider,
  AuthTokenService,
  JwtHelperService
];

@NgModule({
  imports: [
    StoreModule.forFeature('authCheck', reducers.authCheck),
    StoreModule.forFeature('currentUser', reducers.currentUser),
    StoreModule.forFeature('permissionCheck', reducers.permissionCheck),
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

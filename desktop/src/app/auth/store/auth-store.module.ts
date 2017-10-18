/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   18-10-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 18-10-2017
 */

import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/authguard.service';
import { AuthEffects } from './effects/auth.effects';
import { StorageService } from '../../../core/services/storage.service';

import { AuthReducers } from './reducers';
//import { AuthActions } from './actions/auth.actions';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { JwtHelper, AuthHttp, AuthConfig } from 'angular2-jwt';

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
  // StorageService,
  // StorageService alerady import by core/store : have to choise which module import it.
  // Or do an extendable service.
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
    HttpModule,
    StoreModule.forFeature('authCheck', AuthReducers.authCheck),
    StoreModule.forFeature('currentUser', AuthReducers.currentUser),
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

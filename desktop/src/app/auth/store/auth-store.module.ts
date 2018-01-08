import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { Http, RequestOptions } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../services/auth_cookiesecure.service';
import { AuthEffects } from './effects/auth.effects';

import { reducers } from './reducers';

export const AuthProviders = [
  AuthService,
  JwtHelper
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

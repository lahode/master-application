/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   18-10-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 18-10-2017
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppReducers } from './reducers';
import { AppActions } from './actions/app.actions';
import { EndpointsService } from '../services/endpoints';
import { StorageService } from '../services/storage.service';

export const AppProviders = [
  EndpointsService,
  StorageService, // why not into auth/services/ ??? Or why not an abstract class???
  AppActions, // have to convert like AuthActions
]

@NgModule({
  imports: [
    StoreModule.forRoot(AppReducers),
    EffectsModule.forRoot([])
  ],
})
export class AppStoreModule {
  static forRoot() {
    return {
      ngModule: AppStoreModule,
      providers: [AppProviders]
    };
  }
}

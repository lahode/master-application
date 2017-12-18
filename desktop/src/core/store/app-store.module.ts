import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppReducers } from './reducers';
import { EndpointsService } from '../services/endpoints';
import { StorageService } from '../services/storage.service';

export const AppProviders = [
  EndpointsService,
  StorageService
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

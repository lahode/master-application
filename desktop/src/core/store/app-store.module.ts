import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppReducers } from './reducers';
import { AppActions } from './actions/app.actions';
import { EndpointsService } from '../services/endpoints';
import { StorageService } from '../services/storage.service';

export const AppProviders = [
  EndpointsService,
  StorageService,
  AppActions,
]

@NgModule({
  imports: [
    StoreModule.forRoot(AppReducers),
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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';

import { reducers, metaReducers } from './reducers';
import { AppEffects } from './effects/app.effects';
import { EndpointsService } from '../services/endpoints';
import { StorageService } from '../services/storage.service';
import { ErrorHandlerService } from '../services/errorhandler.service';
import { FileService } from '../services/file.service';
import { PagerService } from '../services/pager.service';
import { SocketService } from '../services/socket.service';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const { url } = routerState;
    const queryParams = routerState.root.queryParams;
    const params = route.params;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}

export const AppProviders = [
  EndpointsService,
  StorageService,
  ErrorHandlerService,
  FileService,
  PagerService,
  SocketService,
  { provide: RouterStateSerializer, useClass: CustomSerializer }
]

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule
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

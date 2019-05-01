import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';

import { reducers, metaReducers } from './reducers';

import { EndpointsService } from '../services/endpoints';
import { ErrorHandlerService } from '../services/errorhandler.service';
import { ExportService } from '../services/export.service';
import { FileService, ImageDataConverterService } from '../services/file.service';
import { LoaderService } from '../services/loader.service';
import { MediaQueryService } from '../services/media-query.service';
import { NavigationService } from '../services/navigation.service';
import { PagerService } from '../services/pager.service';
import { ScrollPager } from '../services/scrollpager.service';
import { SocketService } from '../services/socket.service';
import { StorageService } from '../services/storage.service';

import { AppEffects } from './effects/app.effects';
import { MenuLinksEffects } from './effects/menulinks.effects';
import { PreviousNavigationEffects } from './effects/previous-navigation.effects';

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
  ErrorHandlerService,
  ExportService,
  FileService,
  ImageDataConverterService,
  LoaderService,
  MediaQueryService,
  NavigationService,
  PagerService,
  ScrollPager,
  SocketService,
  StorageService,
  { provide: RouterStateSerializer, useClass: CustomSerializer }
];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      AppEffects, MenuLinksEffects, PreviousNavigationEffects
    ]),
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

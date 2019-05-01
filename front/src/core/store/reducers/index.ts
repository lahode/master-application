import { MetaReducer, ActionReducerMap } from '@ngrx/store';
// import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';

import * as fromLoading from './loading-reducer';
import * as fromError from './error-reducer';
import * as fromLanguage from './language-reducer';
import * as fromBreadcrumb from './breadcrumb-reducer';
import * as fromConfirm from './confirm-reducer';
import * as fromMessage from './message-reducer';
import * as fromMenuLinks from './menulinks-reducer';
import * as fromSocket from './socket-reducer';

import { AppStateI, AppReducerStateI } from '../app-states';

export const reducer: AppReducerStateI = {
  router: routerReducer,
  loading: fromLoading.reducer,
  error: fromError.reducer,
  language: fromLanguage.reducer,
  breadcrumb: fromBreadcrumb.reducer,
  confirm: fromConfirm.reducer,
  message: fromMessage.reducer,
  menuLinks: fromMenuLinks.reducer,
  socket: fromSocket.reducer
};

export const reducers: ActionReducerMap<AppStateI> = reducer;
// export const metaReducers: MetaReducer<AppStateI>[] = process.env.NODE_ENV === 'development' ? [storeFreeze] : [];
export const metaReducers: MetaReducer<AppStateI>[] = [];

import { MetaReducer, ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';

import * as fromLoading from './loading-reducer';
import * as fromError from './error-reducer';
import * as fromLanguage from './language-reducer';
import * as fromBreadcrumb from './breadcrumb-reducer';
import * as fromConfirm from './confirm-reducer';
import * as fromSocket from './socket-reducer';

import { AppStateI, AppReducerStateI } from '../app-states';

declare const process: any;

export const reducer: AppReducerStateI = {
  router: routerReducer,
  loading: fromLoading.reducer,
  error: fromError.reducer,
  language: fromLanguage.reducer,
  breadcrumb: fromBreadcrumb.reducer,
  confirm: fromConfirm.reducer,
  socket: fromSocket.reducer
};

export const reducers: ActionReducerMap<AppStateI> = reducer;
export const metaReducers: MetaReducer<AppStateI>[] = process.env.NODE_ENV === 'development' ? [storeFreeze] : [];

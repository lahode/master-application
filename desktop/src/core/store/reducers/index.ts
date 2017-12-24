import { MetaReducer, ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';


import * as fromLoading from './loadingReducer';
import * as fromLoaded from './loadedReducer';
import * as fromError from './errorReducer';

import { AppStateI, AppRecucerStateI } from '../app-states';

declare const process: any;

export const reducer:AppRecucerStateI = {
  router: routerReducer,
  loading: fromLoading.reducer,
  loaded: fromLoaded.reducer,
  error: fromError.reducer
};

export const reducers:ActionReducerMap<AppStateI> = reducer;
export const metaReducers: MetaReducer<AppStateI>[] = process.env.NODE_ENV == 'development' ? [storeFreeze]: [];

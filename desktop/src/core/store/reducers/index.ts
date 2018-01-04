import { MetaReducer, ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';


import * as fromLoading from './loadingReducer';
import * as fromError from './errorReducer';
import * as fromConfirm from './confirmReducer';

import { AppStateI, AppRecucerStateI } from '../app-states';

declare const process: any;

export const reducer: AppRecucerStateI = {
  router: routerReducer,
  loading: fromLoading.reducer,
  error: fromError.reducer,
  confirm: fromConfirm.reducer
};

export const reducers: ActionReducerMap<AppStateI> = reducer;
export const metaReducers: MetaReducer<AppStateI>[] = process.env.NODE_ENV === 'development' ? [storeFreeze] : [];

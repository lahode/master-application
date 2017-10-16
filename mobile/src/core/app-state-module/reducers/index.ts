import { ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromLoading from './loadingReducer';
import * as fromLoaded from './loadedReducer';
import * as fromQueryParams from './queryParamsReducer';
import * as fromCurrentUser from './currentUserReducer';
import * as fromAuthCheck from './authCheckedReducer';
import * as fromError from './errorReducer';

import { AppStateI, RecucerStateI } from '../app-state';

declare const process: any;

// const reducers: RecucerStateI = {
const reducers = {
  loading: fromLoading.reducer,
  loaded: fromLoaded.reducer,
  queryParams: fromQueryParams.reducer,
  authCheck: fromAuthCheck.reducer,
  currentUser: fromCurrentUser.reducer,
  error: fromError.reducer
};

const developmentReducer: ActionReducerMap<AppStateI> = reducers;
const productionReducer: ActionReducerMap<AppStateI> = reducers;

// export const reducer: ActionReducerMap<AppStateI> = process.env.IONIC_ENV === 'prod' ? productionReducer :  developmentReducer;
export const reducer: ActionReducerMap<AppStateI> = developmentReducer;

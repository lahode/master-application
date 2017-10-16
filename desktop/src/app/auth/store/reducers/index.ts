import { ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromCurrentUser from './current-user-reducer';
import * as fromAuthCheck from './auth-checked-reducer';

import { AuthStateI, AuthRecucerStateI } from '../auth-state';

declare const process: any;

// const reducers: AuthRecucerStateI = {
const reducers = {
  authCheck: fromAuthCheck.reducer,
  currentUser: fromCurrentUser.reducer,
};

const developmentReducer: ActionReducerMap<AuthStateI> = reducers;
const productionReducer: ActionReducerMap<AuthStateI> = reducers;

// export const reducer: ActionReducerMap<AppStateI> = process.env.IONIC_ENV === 'prod' ? productionReducer :  developmentReducer;
export const AuthReducers: ActionReducerMap<AuthStateI> = developmentReducer;

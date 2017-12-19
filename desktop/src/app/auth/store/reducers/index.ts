import { ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromCurrentUser from './current-user-reducer';
import * as fromAuthCheck from './auth-checked-reducer';

import { AuthStateI, AuthRecucerStateI } from '../auth-state';

declare const process: any;

export const reducer:AuthRecucerStateI = {
  authCheck: fromAuthCheck.reducer,
  currentUser: fromCurrentUser.reducer,
};

export const reducers:ActionReducerMap<AuthStateI> = reducer;

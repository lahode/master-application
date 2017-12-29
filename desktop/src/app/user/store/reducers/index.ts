import { ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromUsers from './users-reducer';
import * as fromUser from './user-reducer';
import * as fromRoles from './roles-reducer';
import * as fromRole from './role-reducer';

import { UserStateI, UserRecucerStateI } from '../user-state';

declare const process: any;

export const reducer: UserRecucerStateI = {
  userList: fromUsers.reducer,
  userEdit: fromUser.reducer,
  roleList: fromRoles.reducer,
  roleEdit: fromRole.reducer
};

export const reducers: ActionReducerMap<UserStateI> = reducer;

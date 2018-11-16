import { ActionReducerMap, combineReducers, ActionReducer, Action } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromUsers from './userslist-reducer';
import * as fromUser from './user-reducer';
import * as fromRoles from './roles-reducer';
import * as fromRole from './role-reducer';
import * as fromPermissions from './permissions-reducer';

import { UserStateI, UserRecucerStateI } from '../user-state';

declare const process: any;

export const reducer: UserRecucerStateI = {
  usersList: fromUsers.reducer,
  userEdit: fromUser.reducer,
  rolesList: fromRoles.reducer,
  roleEdit: fromRole.reducer,
  permissionsList: fromPermissions.reducer,
};

export const reducers: ActionReducerMap<UserStateI> = reducer;

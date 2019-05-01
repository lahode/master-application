import { ActionReducerMap } from '@ngrx/store';

import * as fromCurrentUser from './current-user-reducer';
import * as fromAuthCheck from './auth-checked-reducer';
import * as fromPermissionCheck from './perm-checked-reducer';

import { AuthStateI, AuthRecucerStateI } from '../auth-state';

export const reducer: AuthRecucerStateI = {
  authCheck: fromAuthCheck.reducer,
  currentUser: fromCurrentUser.reducer,
  permissionCheck: fromPermissionCheck.reducer
};

export const reducers: ActionReducerMap<AuthStateI> = reducer;

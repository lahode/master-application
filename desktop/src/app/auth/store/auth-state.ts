import { Action } from '@ngrx/store';

import { IAuthCheckedState } from './reducers/auth-checked-reducer';
import { IPermCheckedState } from './reducers/perm-checked-reducer';
import { ICurrentUserState } from './reducers/current-user-reducer';

export interface AuthStateI {
  authCheck: IAuthCheckedState;
  permissionCheck: IPermCheckedState;
  currentUser?: ICurrentUserState;
}

export interface AuthRecucerStateI {
  authCheck: (state: IAuthCheckedState, action: Action) => IAuthCheckedState;
  permissionCheck: (state: IPermCheckedState, action: Action) => IPermCheckedState;
  currentUser?: (state: ICurrentUserState, action: Action) => ICurrentUserState;
}

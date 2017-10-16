import { Action } from '@ngrx/store';

import { IAuthCheckedState } from './reducers/auth-checked-reducer';
import { ICurrentUserState } from './reducers/current-user-reducer';

export interface AuthStateI {
  authCheck: IAuthCheckedState,
  currentUser?: ICurrentUserState,
}

export interface AuthRecucerStateI {
  authCheck: (state: IAuthCheckedState, action: Action) => IAuthCheckedState,
  currentUser?: (state: ICurrentUserState, action: Action) => ICurrentUserState,
}

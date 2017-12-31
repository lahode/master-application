import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface IAuthCheckedState extends Number {}

export const initialState: IAuthCheckedState = -1;

export function reducer (state: IAuthCheckedState = initialState, action: any): IAuthCheckedState {
  switch (action.type) {
    case AuthActions.LOGIN:
    case AuthActions.CHECK_AUTH: {
      return -1;
    }

    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.CHECK_AUTH_SUCCESS: {
      return 1;
    }

    case AuthActions.LOGIN_FAILED:
    case AuthActions.CHECK_AUTH_FAILED:
    case AuthActions.CHECK_AUTH_NO_USER:
    case AuthActions.LOGOUT_SUCCESS: {
      return 0;
    }

    default: {
      return Object.assign({}, <IAuthCheckedState>state);
    }

  }
}

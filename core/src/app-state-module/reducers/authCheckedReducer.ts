import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface IAuthCheckedState extends Boolean {}

export const initialState: IAuthCheckedState = false;

export function reducer (state: IAuthCheckedState = initialState, action: any): IAuthCheckedState {
  switch (action.type) {
    case AuthActions.LOGIN_SUCCESS: {
      return true;
    }

    case AuthActions.CHECK_AUTH_SUCCESS: {
      return true;
    }

    case AuthActions.CHECK_AUTH_FAILED: {
      return false;
    }

    case AuthActions.LOGOUT_SUCCESS: {
      return Object.assign(initialState);
    }

    default: {
      return <IAuthCheckedState>state;
    }
  }
}

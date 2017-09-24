import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface ILoadedState extends Boolean {}

export const intitialState: ILoadedState = false;

export function reducer (state: ILoadedState = intitialState, action: any): ILoadedState {
  switch (action.type) {
    case AuthActions.CHECK_AUTH_SUCCESS: {
      return true;
    }
    case AuthActions.CHECK_AUTH_FAILED: {
      return false;
    }
    case AuthActions.CHECK_AUTH_NO_USER: {
      return false;
    }

    case AuthActions.LOGIN: {
      return false;
    }
    case AuthActions.LOGIN_SUCCESS: {
      return true;
    }
    case AuthActions.LOGIN_FAILED: {
      return false;
    }

    case AuthActions.LOGOUT: {
      return false;
    }
    case AuthActions.LOGOUT_SUCCESS: {
      return true;
    }

    default: {
      return <ILoadedState>state;
    }
  }
}

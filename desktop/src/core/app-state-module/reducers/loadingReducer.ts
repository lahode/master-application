import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface ILoadingState extends Boolean {}

export const intitialState: ILoadingState = false;

export function reducer (state: ILoadingState = intitialState, action: any): ILoadingState {
  switch (action.type) {
    case AuthActions.CHECK_AUTH: {
      return true;
    }
    case AuthActions.CHECK_AUTH_SUCCESS: {
      return false;
    }
    case AuthActions.CHECK_AUTH_FAILED: {
      return false;
    }
    case AuthActions.CHECK_AUTH_NO_USER: {
      return false;
    }

    case AuthActions.LOGIN: {
      return true;
    }
    case AuthActions.LOGIN_SUCCESS: {
      return false;
    }
    case AuthActions.LOGIN_FAILED: {
      return false;
    }

    case AuthActions.LOGOUT: {
      return true;
    }
    case AuthActions.LOGOUT_SUCCESS: {
      return false;
    }

    default: {
      return <ILoadingState>state;
    }
  }
}

import { Action } from '@ngrx/store';
import { AuthActions } from '../../../app/auth/store';

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

    case AuthActions.CREATE_USER: {
      return false;
    }
    case AuthActions.CREATE_USER_SUCCESS: {
      return true;
    }
    case AuthActions.CREATE_USER_FAILED: {
      return false;
    }

    case AuthActions.GET_PASSWORD: {
      return false;
    }
    case AuthActions.GET_PASSWORD_SUCCESS: {
      return true;
    }
    case AuthActions.GET_PASSWORD_FAILED: {
      return false;
    }

    default: {
      return <ILoadedState>state;
    }
  }
}

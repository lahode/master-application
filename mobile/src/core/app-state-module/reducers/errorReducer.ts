import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface IErrorState extends String {}

export const intitialState: IErrorState = null;

export function reducer (state: IErrorState = intitialState, action: any): IErrorState {
  switch (action.type) {
    case AuthActions.LOGIN_FAILED: {
      return Object.assign(action.payload);
    }
    case AuthActions.LOGOUT_FAILED: {
      return Object.assign(action.payload);
    }
    case AuthActions.CHECK_AUTH_FAILED: {
      return Object.assign(action.payload);
    }
    case AuthActions.CREATE_USER_FAILED: {
      return Object.assign(action.payload);
    }
    case AuthActions.GET_PASSWORD_FAILED: {
      return Object.assign(action.payload);
    }
    case AuthActions.ERROR_NULL: {
      return null;
    }
    default: {
      return <IErrorState>intitialState;
    }
  }
}

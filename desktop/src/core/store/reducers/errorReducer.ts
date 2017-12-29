import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';
import { AuthActions } from '../../../app/auth/store';

export interface IErrorState extends String {}

export const intitialState: IErrorState = null;

export function reducer (state: IErrorState = intitialState, action: any): IErrorState {
  switch (action.type) {

    case AppActions.ERROR_SET:
    case AuthActions.LOGIN_FAILED:
    case AuthActions.LOGOUT_FAILED:
    case AuthActions.CHECK_AUTH_FAILED:
    case AuthActions.CREATE_USER_FAILED:

    case AuthActions.GET_PASSWORD_FAILED: {
      return Object.assign(action.payload);
    }

    case AppActions.ERROR_NULL: {
      return null;
    }

    default: {
      return <IErrorState>intitialState;
    }
  }
}

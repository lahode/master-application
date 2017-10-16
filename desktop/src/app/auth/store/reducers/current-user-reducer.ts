import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface ICurrentUserState extends Object {}

export const intitialState: ICurrentUserState = null;

export function reducer (state: ICurrentUserState = intitialState, action: any): ICurrentUserState {
  switch (action.type) {
    case AuthActions.LOGIN_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }

    case AuthActions.CHECK_AUTH_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }

    case AuthActions.LOGOUT_SUCCESS: {
      return intitialState;
    }

    case AuthActions.CREATE_USER_SUCCESS: {
      return Object.assign({},  action.payload);
    }

    default: {
      return <ICurrentUserState>state;
    }
  }
}

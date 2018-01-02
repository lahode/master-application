import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface ICurrentUserState extends Object {}

export const initialState: ICurrentUserState = null;

export function reducer (state: ICurrentUserState = initialState, action: any): ICurrentUserState {
  switch (action.type) {

    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.CHECK_AUTH_SUCCESS:
    case AuthActions.CREATE_USER_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }

    case AuthActions.LOGIN_FAILED:
    case AuthActions.CHECK_AUTH_FAILED:
    case AuthActions.LOGOUT_SUCCESS: {
      return null;
    }
  }

  return <ICurrentUserState>state;

}

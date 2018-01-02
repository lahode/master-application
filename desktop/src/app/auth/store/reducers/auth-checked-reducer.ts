import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface IAuthCheckedState extends Boolean {}

export const initialState: IAuthCheckedState = false;

export function reducer (state: IAuthCheckedState = initialState, action: any): IAuthCheckedState {
  switch (action.type) {

    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.CHECK_AUTH_SUCCESS: {
      return true;
    }

    case AuthActions.LOGIN_FAILED:
    case AuthActions.CHECK_AUTH_FAILED:
    case AuthActions.LOGOUT_SUCCESS: {
      return false;
    }
  }

  return <IAuthCheckedState>state;

}

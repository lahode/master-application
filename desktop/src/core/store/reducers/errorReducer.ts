import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';
import { AuthActions } from '../../../app/auth/store';
import { UserActions } from '../../../app/user/store';
import { RoleActions } from '../../../app/user/store';

export interface IErrorState extends String {}

export const intitialState: IErrorState = null;

export function reducer (state: IErrorState = intitialState, action: any): IErrorState {
  switch (action.type) {

    case AppActions.ERROR_SET:
    case AuthActions.LOGIN_FAILED:
    case AuthActions.LOGOUT_FAILED:
    case AuthActions.CHECK_AUTH_FAILED:
    case AuthActions.CHECK_PERMISSIONS_FAILED:
    case AuthActions.CREATE_USER_FAILED:
    case AuthActions.GET_PASSWORD_FAILED:
    case UserActions.USERLIST_LOAD_FAILED:
    case UserActions.USER_LOAD_FAILED:
    case UserActions.USER_CREATE_FAILED:
    case UserActions.USER_UPDATE_FAILED:
    case UserActions.USER_REMOVE_FAILED:
    case RoleActions.ROLELIST_LOAD_FAILED:
    case RoleActions.ROLE_LOAD_FAILED:
    case RoleActions.ROLE_CREATE_FAILED:
    case RoleActions.ROLE_UPDATE_FAILED:
    case RoleActions.ROLE_REMOVE_FAILED: {
      return Object.assign(action.payload);
    }

    case AppActions.ERROR_NULL: {
      return null;
    }

    default: {
      return <IErrorState>state;
    }
  }
}

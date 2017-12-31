import { Action } from '@ngrx/store';
import { AuthActions } from '../../../app/auth/store';
import { UserActions } from '../../../app/user/store';
import { RoleActions } from '../../../app/user/store';

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

    case AuthActions.CHECK_PERMISSIONS: {
      return true;
    }
    case AuthActions.CHECK_PERMISSIONS_SUCCESS: {
      return false;
    }
    case AuthActions.CHECK_PERMISSIONS_FAILED: {
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

    case AuthActions.CREATE_USER: {
      return true;
    }
    case AuthActions.CREATE_USER_SUCCESS: {
      return false;
    }
    case AuthActions.CREATE_USER_FAILED: {
      return false;
    }

    case AuthActions.GET_PASSWORD: {
      return true;
    }
    case AuthActions.GET_PASSWORD_SUCCESS: {
      return false;
    }
    case AuthActions.GET_PASSWORD_FAILED: {
      return false;
    }

    case UserActions.USERLIST_LOAD: {
      return true;
    }
    case UserActions.USERLIST_LOAD_SUCCESS: {
      return false;
    }
    case UserActions.USERLIST_LOAD_FAILED: {
      return false;
    }

    case UserActions.USER_LOAD: {
      return true;
    }
    case UserActions.USER_LOAD_SUCCESS: {
      return false;
    }
    case UserActions.USER_LOAD_FAILED: {
      return false;
    }

    case UserActions.USER_CREATE: {
      return true;
    }
    case UserActions.USER_CREATE_SUCCESS: {
      return false;
    }
    case UserActions.USER_CREATE_FAILED: {
      return false;
    }

    case UserActions.USER_UPDATE: {
      return true;
    }
    case UserActions.USER_UPDATE_SUCCESS: {
      return false;
    }
    case UserActions.USER_UPDATE_FAILED: {
      return false;
    }

    case UserActions.USER_REMOVE: {
      return true;
    }
    case UserActions.USER_REMOVE_SUCCESS: {
      return false;
    }
    case UserActions.USER_REMOVE_FAILED: {
      return false;
    }

    case RoleActions.ROLELIST_LOAD: {
      return true;
    }
    case RoleActions.ROLELIST_LOAD_SUCCESS: {
      return false;
    }
    case RoleActions.ROLELIST_LOAD_FAILED: {
      return false;
    }

    case RoleActions.ROLE_LOAD: {
      return true;
    }
    case RoleActions.ROLE_LOAD_SUCCESS: {
      return false;
    }
    case RoleActions.ROLE_LOAD_FAILED: {
      return false;
    }

    case RoleActions.ROLE_CREATE: {
      return true;
    }
    case RoleActions.ROLE_CREATE_SUCCESS: {
      return false;
    }
    case RoleActions.ROLE_CREATE_FAILED: {
      return false;
    }

    case RoleActions.ROLE_UPDATE: {
      return true;
    }
    case RoleActions.ROLE_UPDATE_SUCCESS: {
      return false;
    }
    case RoleActions.ROLE_UPDATE_FAILED: {
      return false;
    }

    case RoleActions.ROLE_REMOVE: {
      return true;
    }
    case RoleActions.ROLE_REMOVE_SUCCESS: {
      return false;
    }
    case RoleActions.ROLE_REMOVE_FAILED: {
      return false;
    }

    default: {
      return <ILoadingState>state;
    }

  }
}

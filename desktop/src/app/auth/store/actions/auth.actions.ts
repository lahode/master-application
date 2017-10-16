import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

/**
 * Define every actions for authentication
 */
@Injectable()
export class AuthActions {

  static LOGIN = 'LOGIN';
  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
  static LOGIN_FAILED = 'LOGIN_FAILED';

  static LOGOUT = 'LOGOUT';
  static LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
  static LOGOUT_FAILED = 'LOGOUT_FAILED';

  static CHECK_AUTH = 'CHECK_AUTH';
  static CHECK_AUTH_SUCCESS = 'CHECK_AUTH_SUCCESS';
  static CHECK_AUTH_FAILED = 'CHECK_AUTH_FAILED';
  static CHECK_AUTH_NO_USER = 'CHECK_AUTH_NO_USER';

  static CREATE_USER = 'CREATE_USER';
  static CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
  static CREATE_USER_FAILED = 'CREATE_USER_FAILED';

  static GET_PASSWORD = 'GET_PASSWORD';
  static GET_PASSWORD_SUCCESS = 'GET_PASSWORD_SUCCESS';
  static GET_PASSWORD_FAILED = 'GET_PASSWORD_FAILED';

  login(_credentials ): Action {
    return <Action>{
      type: AuthActions.LOGIN,
      payload: _credentials
    };
  }

  checkAuth(): Action {
    return <Action>{
      type: AuthActions.CHECK_AUTH,
    };
  }

  checkAuthNoUser(): Action {
    return <Action>{
      type: AuthActions.CHECK_AUTH_NO_USER,
      payload: null
    };
  }

  logout() {
    return <Action>{
      type: AuthActions.LOGOUT,
    };
  }

  signup(_credentials ): Action {
    return <Action>{
      type: AuthActions.CREATE_USER,
      payload: _credentials
    };
  }

  getPassword(_credentials ): Action {
    return <Action>{
      type: AuthActions.GET_PASSWORD,
      payload: _credentials
    }
  }

}

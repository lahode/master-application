import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

/**
 * Add Todo to Todos Actions
 */
@Injectable()
export class AuthActions {

  static LOGIN:string = 'LOGIN';
  static LOGIN_SUCCESS:string = 'LOGIN_SUCCESS';
  static LOGIN_FAILED:string = 'LOGIN_FAILED';

  static LOGOUT:string = 'LOGOUT';
  static LOGOUT_SUCCESS:string = 'LOGOUT_SUCCESS';
  static LOGOUT_FAILED:string = 'LOGOUT_FAILED';

  static CHECK_AUTH:string = 'CHECK_AUTH';
  static CHECK_AUTH_SUCCESS:string = 'CHECK_AUTH_SUCCESS';
  static CHECK_AUTH_FAILED:string = 'CHECK_AUTH_FAILED';
  static CHECK_AUTH_NO_USER:string = 'CHECK_AUTH_NO_USER';

  static CREATE_USER:string = 'CREATE_USER';
  static CREATE_USER_SUCCESS:string = 'CREATE_USER_SUCCESS';
  static CREATE_USER_FAILED:string = 'CREATE_USER_FAILED';

  login(_credentials ): Action {
    return <Action>{
      type: AuthActions.LOGIN,
      payload: _credentials.value
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

  create_user(_credentials ): Action {
    return <Action>{
      type: AuthActions.CREATE_USER,
      payload: _credentials.value
    };
  }
}

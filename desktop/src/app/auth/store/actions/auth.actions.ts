import { Action } from '@ngrx/store';

/**
 * Define every actions for authentication
 */
export const AuthActions = {

  LOGIN : 'LOGIN',
  LOGIN_SUCCESS : 'LOGIN_SUCCESS',
  LOGIN_FAILED : 'LOGIN_FAILED',

  LOGOUT : 'LOGOUT',
  LOGOUT_SUCCESS : 'LOGOUT_SUCCESS',
  LOGOUT_FAILED : 'LOGOUT_FAILED',

  CHECK_AUTH : 'CHECK_AUTH',
  CHECK_AUTH_SUCCESS : 'CHECK_AUTH_SUCCESS',
  CHECK_AUTH_FAILED : 'CHECK_AUTH_FAILED',
  CHECK_AUTH_NO_USER : 'CHECK_AUTH_NO_USER',

  CREATE_USER : 'CREATE_USER',
  CREATE_USER_SUCCESS : 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILED : 'CREATE_USER_FAILED',

  GET_PASSWORD : 'GET_PASSWORD',
  GET_PASSWORD_SUCCESS : 'GET_PASSWORD_SUCCESS',
  GET_PASSWORD_FAILED : 'GET_PASSWORD_FAILED',

  login(_credentials) {
    return <Action>{
      type: AuthActions.LOGIN,
      payload: _credentials
    };
  },

  checkAuth() {
    return <Action>{
      type: AuthActions.CHECK_AUTH,
    };
  },

  checkAuthNoUser() {
    return <Action>{
      type: AuthActions.CHECK_AUTH_NO_USER,
      payload: null
    };
  },

  logout()  {
    return <Action>{
      type: AuthActions.LOGOUT
    };
  },
  
  signup(_credentials)  {
    return <Action>{
      type: AuthActions.CREATE_USER,
      payload: _credentials
    };
  },
  
  getPassword(_credentials)  {
    return <Action>{
      type: AuthActions.GET_PASSWORD,
      payload: _credentials
    };
  }
  
}

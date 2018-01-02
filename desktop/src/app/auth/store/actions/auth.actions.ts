import { Action } from '@ngrx/store';

/**
 * Define every actions for authentication
 */
export const AuthActions = {

  LOGIN_START : 'LOGIN_START',
  LOGIN_SUCCESS : 'LOGIN_SUCCESS',
  LOGIN_FAILED : 'LOGIN_FAILED',

  LOGOUT_START : 'LOGOUT_START',
  LOGOUT_SUCCESS : 'LOGOUT_SUCCESS',
  LOGOUT_FAILED : 'LOGOUT_FAILED',

  CHECK_AUTH_START : 'CHECK_AUTH_START',
  CHECK_AUTH_SUCCESS : 'CHECK_AUTH_SUCCESS',
  CHECK_AUTH_FAILED : 'CHECK_AUTH_FAILED',
  CHECK_AUTH_STOP : 'CHECK_AUTH_STOP',

  CHECK_PERMISSIONS_START : 'CHECK_PERMISSIONS_START',
  CHECK_PERMISSIONS_SUCCESS : 'CHECK_PERMISSIONS_SUCCESS',
  CHECK_PERMISSIONS_FAILED : 'CHECK_PERMISSIONS_FAILED',

  CREATE_USER_START : 'CREATE_USER_START',
  CREATE_USER_SUCCESS : 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILED : 'CREATE_USER_FAILED',

  GET_PASSWORD_START : 'GET_PASSWORD_START',
  GET_PASSWORD_SUCCESS : 'GET_PASSWORD_SUCCESS',
  GET_PASSWORD_FAILED : 'GET_PASSWORD_FAILED',

  login(_credentials) {
    return <Action>{
      type: AuthActions.LOGIN_START,
      payload: _credentials
    };
  },

  checkAuth() {
    return <Action>{
      type: AuthActions.CHECK_AUTH_START,
    };
  },

  checkPermission(_credentials) {
    return <Action>{
      type: AuthActions.CHECK_PERMISSIONS_START,
      payload: _credentials
    };
  },

  logout()  {
    return <Action>{
      type: AuthActions.LOGOUT_START
    };
  },

  signup(_credentials)  {
    return <Action>{
      type: AuthActions.CREATE_USER_START,
      payload: _credentials
    };
  },

  getPassword(_credentials)  {
    return <Action>{
      type: AuthActions.GET_PASSWORD_START,
      payload: _credentials
    };
  }

}

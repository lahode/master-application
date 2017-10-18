/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   18-10-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 18-10-2017
 */

//import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

/**
 * Define every actions for authentication
 */
// @Injectable()
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
}
export class LoginAction  {
  constructor(_credentials ){
      return <Action>{
        type: AuthActions.LOGIN,
        payload: _credentials
      };
    }
}

export class CheckAuthAction  {
  constructor( ){
      return <Action>{
          type: AuthActions.CHECK_AUTH,
      };
    }
}

export class checkAuthNoUserAction  {
  constructor( ) {
      return <Action>{
          type: AuthActions.CHECK_AUTH_NO_USER,
          payload: null
      };
    }
}
export class logoutAction  {
  constructor( ) {
      return <Action>{
          type: AuthActions.LOGOUT
      };
    }
}
export class signupAction  {
  constructor(_credentials ) {
      return <Action>{
        type: AuthActions.CREATE_USER,
        payload: _credentials
      };
    }
}
export class getPasswordAction  {
  constructor(_credentials ) {
      return <Action>{
        type: AuthActions.GET_PASSWORD,
        payload: _credentials
      };
    }
}

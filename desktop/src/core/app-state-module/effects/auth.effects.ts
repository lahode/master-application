import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth-service/auth.service';

@Injectable()
export class AuthEffects {

  // Listen for the 'CHECK_AUTH' action
  @Effect() checkAuthAction$ = this.action$
      .ofType(AuthActions.CHECK_AUTH)
      .switchMap<Action, any>(() => this._auth.checkAuth())
      .map<Action, any>((_result: any) => {
        // If successful, dispatch CHECK_AUTH_SUCCESS action with result else CHECK_AUTH_NO_USER
        if (_result) {
          return <Action>{ type: AuthActions.CHECK_AUTH_SUCCESS, payload: _result };
        } else {
          return <Action>{ type: AuthActions.CHECK_AUTH_NO_USER, payload: null };
        }
        // On errors dispatch CHECK_AUTH_FAILED action with result
      }).catch((res: any) => Observable.of({ type: AuthActions.CHECK_AUTH_FAILED, payload: res }));

  // Listen for the 'LOGIN' action
  @Effect() loginAction$ = this.action$
      .ofType(AuthActions.LOGIN)
      .map<Action, any>(toPayload)
      .switchMap((payload: Observable<any>) => this._auth.login(payload))
      .map<Action, any>((_result: any) => {
        // If successful, dispatch LOGIN_SUCCESS
        return <Action>{ type: AuthActions.LOGIN_SUCCESS, payload: _result };
      })
      // On errors dispatch LOGIN_FAILED action with result
      .catch((res: any) => Observable.of({ type: AuthActions.LOGIN_FAILED, payload: res }));

  // Listen for the 'LOGOUT' action
  @Effect() logoutAction$ = this.action$
      .ofType(AuthActions.LOGOUT)
      .switchMap<Action, any>(() => this._auth.logout())
      // If successful, dispatch success action with result
      .map<Action, any>(() => {
        return <Action>{ type: AuthActions.LOGOUT_SUCCESS, payload: null };
      })
      // On errors dispatch LOGOUT_FAILED action with result
      .catch((res: any) => Observable.of({ type: AuthActions.LOGOUT_FAILED, payload: res }));

  // Listen for the 'CREATE_USER' action
  @Effect() createUserAction$ = this.action$
      .ofType(AuthActions.CREATE_USER)
      .map<Action, any>(toPayload)
      .switchMap((payload: Observable<any>) => this._auth.signup(payload))
      .map<Action, any>((_result: any) => {
        // If successful, dispatch CREATE_USER_SUCCESS
        return <Action>{ type: AuthActions.CREATE_USER_SUCCESS, payload: _result };
      }).catch((res: any) => {
        // On errors dispatch CREATE_USER_FAILED action with result
        return Observable.of({ type: AuthActions.CREATE_USER_FAILED, payload: res });
      });

    constructor(
      private action$: Actions,
      private _auth: AuthService
    ) {}

}

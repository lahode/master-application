import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth_cookiesecure.service';

@Injectable()
export class AuthEffects {

  // Listen for the 'CHECK_AUTH_START' action
  @Effect() checkAuthAction$ = this.action$
      .ofType(AuthActions.CHECK_AUTH_START)
      .switchMap<Action, any>(() => this._auth.checkAuth()
      .map<Action, any>((_result: any) => {
          // If successful, dispatch CHECK_AUTH_SUCCESS action with result else CHECK_AUTH_FAILED
          if (_result) {
            return <Action>{ type: AuthActions.CHECK_AUTH_SUCCESS, payload: _result.user };
          } else {
            return <Action>{ type: AuthActions.CHECK_AUTH_STOP, payload: null };
          }
          // On errors dispatch CHECK_AUTH_FAILED action with result
        }).catch((res: any) => Observable.of({ type: AuthActions.CHECK_AUTH_STOP, payload: res }))
      );

  // Listen for the 'CHECK_PERMISSIONS_START' action
  @Effect() checkPermissionsAction$ = this.action$
      .ofType(AuthActions.CHECK_PERMISSIONS_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: string[]) => this._auth.checkPermissions(payload)
      // If successful, dispatch CHECK_PERMISSIONS_SUCCESS action with result
        .map<Action, any>((_result: any) => <Action>{ type: AuthActions.CHECK_PERMISSIONS_SUCCESS, payload: _result })
        // On errors dispatch CHECK_PERMISSIONS_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.CHECK_PERMISSIONS_FAILED, payload: res }))
      );

  // Listen for the 'LOGIN_START' action
  @Effect() loginAction$ = this.action$
      .ofType(AuthActions.LOGIN_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: Observable<any>) => this._auth.login(payload)
        // If successful, dispatch LOGIN_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: AuthActions.LOGIN_SUCCESS, payload: _result })
        // On errors dispatch LOGIN_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.LOGIN_FAILED, payload: res }))
        // Redirect to Home page
        .do(() => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
          this.router.navigate([`/${returnUrl}`]);
        })
      );

  // Listen for the 'LOGOUT_START' action
  @Effect() logoutAction$ = this.action$
      .ofType(AuthActions.LOGOUT_START)
      .switchMap<Action, any>(() => this._auth.logout()
        // If successful, dispatch success action with result
        .map<Action, any>(() => <Action>{ type: AuthActions.LOGOUT_SUCCESS, payload: null })
        // On errors dispatch LOGOUT_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.LOGOUT_FAILED, payload: res }))
        // Redirect to Sign In page
        .do(() => {
          this.router.navigate(['/signin']);
        })
      );

  // Listen for the 'CREATE_USER_START' action
  @Effect() createUserAction$ = this.action$
      .ofType(AuthActions.CREATE_USER_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: Observable<any>) => this._auth.signup(payload)
        // If successful, dispatch CREATE_USER_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: AuthActions.CREATE_USER_SUCCESS, payload: _result })
        // On errors dispatch CREATE_USER_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.CREATE_USER_FAILED, payload: res }))
        // Redirect to Home page
        .do(() => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
          this.router.navigate([`/${returnUrl}`]);
        })
      );

    // Listen for the 'GET_PASSWORD_START' action
    @Effect() getPasswordAction$ = this.action$
        .ofType(AuthActions.GET_PASSWORD_START)
        .map<Action, any>(toPayload)
        .switchMap((payload: Observable<any>) => this._auth.retrievePassword(payload)
          // If successful, dispatch GET_PASSWORD_SUCCESS
          .map<Action, any>((_result: any) => <Action>{ type: AuthActions.GET_PASSWORD_SUCCESS, payload: _result })
          // On errors dispatch GET_PASSWORD_FAILED action with result
          .catch((res: any) => Observable.of({ type: AuthActions.GET_PASSWORD_FAILED, payload: res }))
        );

    constructor(
      private readonly action$: Actions,
      private readonly _auth: AuthService,
      private readonly router: Router,
      private route: ActivatedRoute
    ) {}

}

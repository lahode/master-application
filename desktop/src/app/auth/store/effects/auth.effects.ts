import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';

import { User } from '../../../../core/models/user';

@Injectable()
export class AuthEffects {

  // Listen for the 'CHECK_AUTH_START' action
  @Effect() checkAuthAction$ = this._action$
    .ofType(AuthActions.CHECK_AUTH_START)
    .withLatestFrom(this._store$)
    .map(([action, storeState]) => {
      (action as any).payload = (storeState as any).currentUser ? (storeState as any).currentUser : {};
      return action;
    })
    .map<Action, any>(toPayload)
    .switchMap((payload: User) => this._auth.checkAuth(payload)
    .map<Action, any>((_result: any) => {
        // If successful, dispatch CHECK_AUTH_SUCCESS action with result else CHECK_AUTH_STOP
        if (_result) {
          return <Action>{ type: AuthActions.CHECK_AUTH_SUCCESS, payload: _result };
        } else {
          return <Action>{ type: AuthActions.CHECK_AUTH_STOP, payload: null };
        }
        // On errors dispatch CHECK_AUTH_STOP action with result
      }).catch((res: any) => Observable.of({ type: AuthActions.CHECK_AUTH_STOP, payload: res }))
    );

    // Listen for the 'CHECK_PERMISSIONS_START' action
    @Effect() checkPermissionsAction$ = this._action$
      .ofType(AuthActions.CHECK_PERMISSIONS_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: string[]) => this._auth.checkPermissions(payload)
      // If successful, dispatch CHECK_PERMISSIONS_SUCCESS action with result
        .map<Action, any>((_result: any) => <Action>{ type: AuthActions.CHECK_PERMISSIONS_SUCCESS, payload: _result })
        // On errors dispatch CHECK_PERMISSIONS_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.CHECK_PERMISSIONS_FAILED, payload: res }))
      );

    // Listen for the 'LOGIN_START' action
    @Effect() loginAction$ = this._action$
      .ofType(AuthActions.LOGIN_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: Observable<any>) => this._auth.login(payload)
        // If successful, dispatch LOGIN_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: AuthActions.LOGIN_SUCCESS, payload: _result })
        // On errors dispatch LOGIN_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.LOGIN_FAILED, payload: res }))
        // Redirect to Home page
        .do(() => {
          const returnUrl = this._route.snapshot.queryParams['returnUrl'] || '';
          this._router.navigate([`/${returnUrl}`]);
        })
      );

    // Listen for the 'LOGOUT_START' action
    @Effect() logoutAction$ = this._action$
      .ofType(AuthActions.LOGOUT_START)
      .switchMap<Action, any>(() => this._auth.logout()
        // If successful, dispatch success action with result
        .map<Action, any>(() => <Action>{ type: AuthActions.LOGOUT_SUCCESS, payload: null })
        // On errors dispatch LOGOUT_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.LOGOUT_FAILED, payload: res }))
        // Redirect to Sign In page
        .do(() => {
          this._router.navigate(['/home']);
        })
      );

    // Listen for the 'CREATE_USER_START' action
    @Effect() createUserAction$ = this._action$
      .ofType(AuthActions.CREATE_USER_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: Observable<any>) => this._auth.signup(payload)
        // If successful, dispatch CREATE_USER_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: AuthActions.CREATE_USER_SUCCESS, payload: _result })
        // On errors dispatch CREATE_USER_FAILED action with result
        .catch((res: any) => Observable.of({ type: AuthActions.CREATE_USER_FAILED, payload: res }))
        // Redirect to Home page
        .do(() => {
          const returnUrl = this._route.snapshot.queryParams['returnUrl'] || '';
          this._router.navigate([`/${returnUrl}`]);
        })
      );

    constructor(
      private readonly _action$: Actions,
      private readonly _auth: AuthService,
      private readonly _store$: Store<Action>,
      private readonly _router: Router,
      private readonly _route: ActivatedRoute
    ) {}

}

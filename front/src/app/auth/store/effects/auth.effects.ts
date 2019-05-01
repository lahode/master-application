import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthActions } from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { AppActions } from '../../../../core/store';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthEffects {

  // Listen for the 'CHECK_AUTH_START' action.
  @Effect() checkAuthAction$ = this._action$
    .pipe(
      ofType(AuthActions.CHECK_AUTH_START),
      switchMap(() => this._auth.checkAuth()
        .pipe(
          map<Action, any>((_result: any) => {
              // If successful, dispatch CHECK_AUTH_SUCCESS action with result else CHECK_AUTH_STOP.
              if (_result) {
                return <Action>{ type: AuthActions.CHECK_AUTH_SUCCESS, payload: _result };
              } else {
                return <Action>{ type: AuthActions.CHECK_AUTH_STOP, payload: null };
              }
              // On errors dispatch CHECK_AUTH_FAILED action with result.
            }),
          catchError(res => {
            if (res.code === 401) {
              // Intercept 401 (in this case user exists but is not active) initiate CHECK_AUTH_FAILED.
              return of({type: AuthActions.CHECK_AUTH_FAILED, payload: res.message});
            } else {
              return of({type: AuthActions.CHECK_AUTH_STOP, payload: null});
            }
          })
        )
      )
    );

  // Listen for the 'CHECK_PERMISSIONS_START' action.
  @Effect() checkPermissionsAction$ = this._action$
    .pipe(
      ofType(AuthActions.CHECK_PERMISSIONS_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: string[]) => this._auth.checkPermissions(payload)
        .pipe(
          // If successful, dispatch CHECK_PERMISSIONS_SUCCESS action with result.
          map<Action, any>((_result: any) => <Action>{ type: AuthActions.CHECK_PERMISSIONS_SUCCESS, payload: _result }),
            // On errors dispatch CHECK_PERMISSIONS_FAILED action with result.
          catchError(res => of({type: AuthActions.CHECK_PERMISSIONS_FAILED, payload: res}))
        )
      )
    );

  // Listen for the 'LOGIN_START' action.
  @Effect() loginAction$ = this._action$
    .pipe(
      ofType(AuthActions.LOGIN_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: Observable<any>) => this._auth.login(payload)
        .pipe(
          // If successful, dispatch LOGIN_SUCCESS action with result.
          map<Action, any>((_result: any) => <Action>{ type: AuthActions.LOGIN_SUCCESS, payload: _result }),
          // On errors dispatch LOGIN_FAILED action with result.
          catchError(res => of({type: AuthActions.LOGIN_FAILED, payload: res})),
          // Redirect to the target page.
          tap((action) => {
            if (action.payload) {
              const returnUrl = this._route.snapshot.queryParams['returnUrl'] || environment.homepage;
              if (action.payload.language) {
                this._store.dispatch(<Action>AppActions.setLanguage(action.payload.language));
              }
              this._router.navigate([`/${returnUrl}`]);
            }
          })
        )
      )
    );

  // Listen for the 'LOGOUT_START' action
  @Effect() logoutAction$ = this._action$
    .pipe(
      ofType(AuthActions.LOGOUT_START),
      switchMap<Action, any>(() => this._auth.logout()
        .pipe(
          // If successful, dispatch LOGOUT_SUCCESS action with result
          map<Action, any>((_result: any) => <Action>{ type: AuthActions.LOGOUT_SUCCESS, payload: null }),
          // On errors dispatch LOGOUT_FAILED action with result
          catchError(res => of({type: AuthActions.LOGOUT_FAILED, payload: res})),
          // Redirect to Homepage
          tap(() => this._router.navigate(['/signin']))
        )
      )
    );

  // Listen for the 'GET_PASSWORD_START' action
  @Effect() getPasswordAction$ = this._action$
    .pipe(
      ofType(AuthActions.GET_PASSWORD_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: Observable<any>) => this._auth.retrievePassword(payload)
        .pipe(
          // If successful, dispatch GET_PASSWORD_SUCCESS action with result
          map<Action, any>((_result: any) => <Action>{ type: AuthActions.GET_PASSWORD_SUCCESS, payload: null }),
          // On errors dispatch GET_PASSWORD_FAILED action with result
          catchError(res => of({type: AuthActions.GET_PASSWORD_FAILED, payload: res})),
          // Redirect to Homepage
          tap((action) => {
            if (action.type === AuthActions.GET_PASSWORD_SUCCESS) {
              this._store.dispatch(<Action>AppActions.setMessage({
                title: 'Réinitialisation du mot de passe',
                message: 'Une nouvelle demande de mot de passe vous a été envoyée par e-mail'
              }));
              this._router.navigate(['/signin']);
            }
          })
        )
      )
    );

  // Listen for the 'RESET_PASSWORD_START' action
  @Effect() resetPasswordAction$ = this._action$
    .pipe(
      ofType(AuthActions.RESET_PASSWORD_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: Observable<any>) => this._auth.resetPassword(payload)
        .pipe(
          // If successful, dispatch RESET_PASSWORD_SUCCESS action with result
          map<Action, any>((_result: any) => <Action>{ type: AuthActions.RESET_PASSWORD_SUCCESS, payload: null }),
          // On errors dispatch RESET_PASSWORD_FAILED action with result
          catchError(res => of({type: AuthActions.RESET_PASSWORD_FAILED, payload: res})),
          // Redirect to Homepage on succeed.
          tap((action) => {
            if (action.type === AuthActions.RESET_PASSWORD_SUCCESS) {
              this._router.navigate([environment.homepage]);
            }
          })
        )
      )
    );

  // Listen for the 'CREATE_USER_START' action.
  @Effect() createUserAction$ = this._action$
    .pipe(
      ofType(AuthActions.CREATE_USER_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: Observable<any>) => this._auth.signup(payload)
        .pipe(
          // If successful, dispatch CREATE_USER_SUCCESS action with result.
          map<Action, any>((_result: any) => <Action>{ type: AuthActions.CREATE_USER_SUCCESS, payload: _result }),
          // On errors dispatch CREATE_USER_FAILED action with result.
          catchError(res => of({type: AuthActions.CREATE_USER_FAILED, payload: res})),
          // Redirect to the target page.
          tap((action) => {
            if (action.payload) {
              const returnUrl = this._route.snapshot.queryParams['returnUrl'] || environment.homepage;
              if (action.payload.language) {
                this._store.dispatch(<Action>AppActions.setLanguage(action.payload.language));
              }
              this._router.navigate([`/${returnUrl}`]);
            }
          })
        )
      )
    );

  constructor(
    private readonly _action$: Actions,
    private readonly _store: Store<Action>,
    private readonly _auth: AuthService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute
  ) {}

}

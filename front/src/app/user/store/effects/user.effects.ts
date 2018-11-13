import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { mergeMap, map, withLatestFrom, switchMap, catchError, tap } from 'rxjs/operators';

import { UserActions } from '../actions/user.actions';
import { AuthActions } from '../../../auth/store/actions/auth.actions';
import { UserService } from '../../services/user.service';
import { PagerService } from '../../../../core/services/pager.service';
import { Range } from '../../../../core/models/range';
import { User } from '../../../../core/models/user';

@Injectable()
export class UserEffects {

  private currentUser: User;
  private currentRoute: any;

  // Listen for the 'USERLIST_LOAD_START' action.
  @Effect() userListAction$ = this._action$
    .ofType(UserActions.USERLIST_LOAD_START)
    .pipe(
      withLatestFrom(this._store$),
      map(([action, storeState]) => {
        // If action payload is empty, get the previous pageIndex and pageSize to set the payload.
        if (!action.hasOwnProperty('payload') || !(action as any).payload) {
          (action as any).payload = this._pagerService.getRange((storeState as any).usersList);
        }
        return action;
      }),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: Range) => this._user.list(payload)
        .pipe(
          // If successful, dispatch USERLIST_LOAD_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USERLIST_LOAD_SUCCESS, payload: _result }),
            // On errors dispatch USERLIST_LOAD_FAILED action with result.
          catchError((res: any) => of({ type: UserActions.USERLIST_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'USERLIST_CHANGE_PAGE' action.
  @Effect() userChangePageAction$ = this._action$
    .ofType(UserActions.USERLIST_CHANGE_PAGE)
    .pipe(
      map<Action, any>((action: Action) => (action as any).payload),
      map((payload: any) => {
        // Get page range, dispatch USERLIST_LOAD_START with range and USERLIST_CHANGE_PAGE_SUCCESS.
        const range = this._pagerService.getRange(payload);
        this._store$.dispatch(UserActions.list(range));
        return <Action>{ type: UserActions.USERLIST_CHANGE_PAGE_SUCCESS, payload };
      })
    );

  // Listen for the 'USER_LOAD_START' action.
  @Effect() userLoadAction$ = this._action$
    .ofType(UserActions.USER_LOAD_START)
    .pipe(
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: string) => this._user.get(payload)
        .pipe(
          // If successful, dispatch USER_LOAD_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_LOAD_SUCCESS, payload: _result }),
          // On errors dispatch USER_LOAD_FAILED action with result.
          catchError((res: any) => of({ type: UserActions.USER_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'USER_CREATE_START' action.
  @Effect() userCreateAction$ = this._action$
    .ofType(UserActions.USER_CREATE_START)
    .pipe(
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._user.create(payload)
        .pipe(
          // If successful, dispatch USER_CREATE_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_CREATE_SUCCESS, payload: _result }),
            // On errors dispatch USER_CREATE_FAILED action with result.
          catchError((res: any) => of({ type: UserActions.USER_CREATE_FAILED, payload: res })),
          // Dispatch UserActions.list() to update the list of users.
          tap(() => this._store$.dispatch(UserActions.list()))
        )
      )
    );

  // Listen for the 'USER_UPDATE_START' action.
  @Effect() userUpdateAction$ = this._action$
    .ofType(UserActions.USER_UPDATE_START)
    .pipe(
      withLatestFrom(this._store$),
      map(([action, storeState]) => {
        // Get current user
        this.currentUser = (storeState as any).currentUser;
        this.currentRoute = (storeState as any).router['state'];
        return action;
      }),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._user.update(payload)
        .pipe(
          // If successful, dispatch USER_UPDATE_SUCCESS.
          mergeMap((_result: any) => {
            const userUpdateSuccess = <Action>{ type: UserActions.USER_UPDATE_SUCCESS, payload: _result };

            // Dispatch as well PROFILE_UPDATE_SUCCESS if user is current user.
            if (this.currentUser._id === _result._id) {
              const profileUpdateSuccess = <Action>{ type: AuthActions.PROFILE_UPDATE_SUCCESS, payload: _result };
              return from([userUpdateSuccess, profileUpdateSuccess]);
            }
            return from([userUpdateSuccess]);
          }),
          // On errors dispatch USER_UPDATE_FAILED action with result
          catchError((res: any) => of({ type: UserActions.USER_UPDATE_FAILED, payload: res })),
          // Dispatch UserActions.list() to update the list of users and redirect to user (only for user/edit) if profile is on success.
          tap((action) => {
            if (action.type === AuthActions.PROFILE_UPDATE_SUCCESS) {
              this._store$.dispatch(UserActions.list());
              if (this.currentRoute.url === '/user/edit') {
                this._router.navigate(['/user']);
              }
            }
          })
        )
      )
    );

    // Listen for the 'USER_REMOVE_START' action.
    @Effect() userRemoveAction$ = this._action$
      .ofType(UserActions.USER_REMOVE_START)
      .pipe(
        map<Action, any>((action: Action) => (action as any).payload),
        switchMap((payload: string) => this._user.remove(payload)
          .pipe(
            // If successful, dispatch USER_REMOVE_SUCCESS.
            map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_REMOVE_SUCCESS, payload: _result }),
              // On errors dispatch USER_REMOVE_FAILED action with result.
            catchError((res: any) => of({ type: UserActions.USER_REMOVE_FAILED, payload: res })),
            // Dispatch UserActions.list() to update the list of users.
            tap(() => this._store$.dispatch(UserActions.list()))
          )
        )
      );

    constructor(
      private readonly _action$: Actions,
      private readonly _user: UserService,
      private readonly _router: Router,
      private readonly _store$: Store<Action>,
      private readonly _pagerService: PagerService,
    ) {}

}

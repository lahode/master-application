import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { map, withLatestFrom, switchMap, catchError, tap } from 'rxjs/operators';

import { UserActions } from '../actions/user.actions';
import { UserService } from '../../services/user.service';
import { PagerService } from '../../../../core/services/pager.service';
import { Range } from '../../../../core/models/range';

@Injectable()
export class UserEffects {

  // Listen for the 'USERLIST_LOAD_START' action
  @Effect() userListAction$ = this.action$
    .ofType(UserActions.USERLIST_LOAD_START)
    .pipe(
      withLatestFrom(this.store$),
      map(([action, storeState]) => {
        // If action payload is empty, get the previous pageIndex and pageSize to set the payload
        if (!action.hasOwnProperty('payload') || !(action as any).payload) {
          (action as any).payload = this.pagerService.getRange((storeState as any).usersList);
        }
        return action;
      }),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: Range) => this._user.list(payload)
        .pipe(
          // If successful, dispatch USERLIST_LOAD_SUCCESS
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USERLIST_LOAD_SUCCESS, payload: _result }),
            // On errors dispatch USERLIST_LOAD_FAILED action with result
          catchError((res: any) => of({ type: UserActions.USERLIST_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'USERLIST_LOAD_START' action
  @Effect() userChangePageAction$ = this.action$
    .ofType(UserActions.USERLIST_CHANGE_PAGE)
    .pipe(
      map<Action, any>((action: Action) => (action as any).payload),
      map((payload: any) => {
        const range = this.pagerService.getRange(payload);
        this.store$.dispatch(UserActions.list(range));
        return <Action>{ type: UserActions.USERLIST_CHANGE_PAGE_SUCCESS, payload };
      })
    );

  // Listen for the 'USER_LOAD_START' action
  @Effect() userLoadAction$ = this.action$
    .ofType(UserActions.USER_LOAD_START)
    .pipe(
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: string) => this._user.get(payload)
        .pipe(
          // If successful, dispatch USER_LOAD_SUCCESS
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_LOAD_SUCCESS, payload: _result }),
          // On errors dispatch USER_LOAD_FAILED action with result
          catchError((res: any) => of({ type: UserActions.USER_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'USER_CREATE_START' action
  @Effect() userCreateAction$ = this.action$
    .ofType(UserActions.USER_CREATE_START)
    .pipe(
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._user.create(payload)
        .pipe(
          // If successful, dispatch USER_CREATE_SUCCESS
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_CREATE_SUCCESS, payload: _result }),
            // On errors dispatch USER_CREATE_FAILED action with result
          catchError((res: any) => of({ type: UserActions.USER_CREATE_FAILED, payload: res })),
          // Dispatch UserActions.list() to update the list of users
          tap(() => this.store$.dispatch(UserActions.list()))
        )
      )
    );

  // Listen for the 'USER_UPDATE_START' action
  @Effect() userUpdateAction$ = this.action$
    .ofType(UserActions.USER_UPDATE_START)
    .pipe(
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._user.update(payload)
        .pipe(
          // If successful, dispatch USER_UPDATE_SUCCESS
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_UPDATE_SUCCESS, payload: _result }),
            // On errors dispatch USER_UPDATE_FAILED action with result
          catchError((res: any) => of({ type: UserActions.USER_UPDATE_FAILED, payload: res })),
          // Dispatch UserActions.list() to update the list of users
          tap(() => this.store$.dispatch(UserActions.list()))
        )
      )
    );

    // Listen for the 'USER_REMOVE_START' action
    @Effect() userRemoveAction$ = this.action$
      .ofType(UserActions.USER_REMOVE_START)
      .pipe(
        map<Action, any>((action: Action) => (action as any).payload),
        switchMap((payload: string) => this._user.remove(payload)
          .pipe(
            // If successful, dispatch USER_REMOVE_SUCCESS
            map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_REMOVE_SUCCESS, payload: _result }),
              // On errors dispatch USER_REMOVE_FAILED action with result
            catchError((res: any) => of({ type: UserActions.USER_REMOVE_FAILED, payload: res })),
            // Dispatch UserActions.list() to update the list of users
            tap(() => this.store$.dispatch(UserActions.list()))
          )
        )
      );

    constructor(
      private readonly action$: Actions,
      private readonly _user: UserService,
      private readonly store$: Store<Action>,
      private readonly pagerService: PagerService,
    ) {}

}

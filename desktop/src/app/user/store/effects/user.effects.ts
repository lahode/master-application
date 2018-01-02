import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { UserActions } from '../actions/user.actions';
import { UserService } from '../../services/user.service';
import { Range } from 'core/models/range';

@Injectable()
export class UserEffects {

  // Listen for the 'USERLIST_LOAD_START' action
  @Effect() userListAction$ = this.action$
      .ofType(UserActions.USERLIST_LOAD_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: Range) => this._user.list(payload)
        // If successful, dispatch USERLIST_LOAD_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: UserActions.USERLIST_LOAD_SUCCESS, payload: _result })
          // On errors dispatch USERLIST_LOAD_FAILED action with result
        .catch((res: any) => Observable.of({ type: UserActions.USERLIST_LOAD_FAILED, payload: res }))
      );

  // Listen for the 'USER_LOAD_START' action
  @Effect() userLoadAction$ = this.action$
      .ofType(UserActions.USER_LOAD_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: string) => this._user.get(payload)
        // If successful, dispatch USER_LOAD_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_LOAD_SUCCESS, payload: _result })
        // On errors dispatch USER_LOAD_FAILED action with result
        .catch((res: any) => Observable.of({ type: UserActions.USER_LOAD_FAILED, payload: res }))
      );

  // Listen for the 'USER_CREATE_START' action
  @Effect() userCreateAction$ = this.action$
      .ofType(UserActions.USER_CREATE_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: any) => this._user.create(payload)
        // If successful, dispatch USER_CREATE_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_CREATE_SUCCESS, payload: _result })
        // On errors dispatch USER_CREATE_FAILED action with result
        .catch((res: any) => Observable.of({ type: UserActions.USER_CREATE_FAILED, payload: res }))
      );

  // Listen for the 'USER_UPDATE_START' action
  @Effect() userUpdateAction$ = this.action$
      .ofType(UserActions.USER_UPDATE_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: any) => this._user.update(payload)
        // If successful, dispatch USER_UPDATE_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_UPDATE_SUCCESS, payload: _result })
        // On errors dispatch USER_UPDATE_FAILED action with result
        .catch((res: any) => Observable.of({ type: UserActions.USER_UPDATE_FAILED, payload: res }))
      );

    // Listen for the 'USER_REMOVE_START' action
    @Effect() userRemoveAction$ = this.action$
        .ofType(UserActions.USER_REMOVE_START)
        .map<Action, any>(toPayload)
        .switchMap((payload: string) => this._user.remove(payload)
          // If successful, dispatch USER_REMOVE_SUCCESS
          .map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_REMOVE_SUCCESS, payload: _result })
          // On errors dispatch USER_REMOVE_FAILED action with result
          .catch((res: any) => Observable.of({ type: UserActions.USER_REMOVE_FAILED, payload: res }))
        );

    constructor(
      private action$: Actions,
      private _user: UserService
    ) {}

}

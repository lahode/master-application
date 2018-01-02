import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { RoleActions } from '../actions/role.actions';
import { RoleService } from '../../services/role.service';

@Injectable()
export class RoleEffects {

  // Listen for the 'ROLELIST_LOAD_START' action
  @Effect() roleListAction$ = this.action$
      .ofType(RoleActions.ROLELIST_LOAD_START)
      .switchMap<Action, any>(() => this._role.list()
        // If successful, dispatch ROLELIST_LOAD_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLELIST_LOAD_SUCCESS, payload: _result })
          // On errors dispatch ROLELIST_LOAD_FAILED action with result
        .catch((res: any) => Observable.of({ type: RoleActions.ROLELIST_LOAD_FAILED, payload: res }))
      );

  // Listen for the 'ROLE_LOAD_START' action
  @Effect() roleLoadAction$ = this.action$
      .ofType(RoleActions.ROLE_LOAD_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: string) => this._role.get(payload)
        // If successful, dispatch ROLE_LOAD_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_LOAD_SUCCESS, payload: _result })
        // On errors dispatch ROLE_LOAD_FAILED action with result
        .catch((res: any) => Observable.of({ type: RoleActions.ROLE_LOAD_FAILED, payload: res }))
      );

  // Listen for the 'ROLE_CREATE_START' action
  @Effect() roleCreateAction$ = this.action$
      .ofType(RoleActions.ROLE_CREATE_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: any) => this._role.create(payload)
        // If successful, dispatch ROLE_CREATE_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_CREATE_SUCCESS, payload: _result })
        // On errors dispatch ROLE_CREATE_FAILED action with result
        .catch((res: any) => Observable.of({ type: RoleActions.ROLE_CREATE_FAILED, payload: res }))
      );

  // Listen for the 'ROLE_UPDATE_START' action
  @Effect() roleUpdateAction$ = this.action$
      .ofType(RoleActions.ROLE_UPDATE_START)
      .map<Action, any>(toPayload)
      .switchMap((payload: any) => this._role.update(payload)
        // If successful, dispatch ROLE_UPDATE_SUCCESS
        .map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_UPDATE_SUCCESS, payload: _result })
        // On errors dispatch ROLE_UPDATE_FAILED action with result
        .catch((res: any) => Observable.of({ type: RoleActions.ROLE_UPDATE_FAILED, payload: res }))
      );

    // Listen for the 'ROLE_REMOVE_START' action
    @Effect() roleRemoveAction$ = this.action$
        .ofType(RoleActions.ROLE_REMOVE_START)
        .map<Action, any>(toPayload)
        .switchMap((payload: string) => this._role.remove(payload)
          // If successful, dispatch ROLE_REMOVE_SUCCESS
          .map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_REMOVE_SUCCESS, payload: _result })
          // On errors dispatch ROLE_REMOVE_FAILED action with result
          .catch((res: any) => Observable.of({ type: RoleActions.ROLE_REMOVE_FAILED, payload: res }))
        );

    constructor(
      private action$: Actions,
      private _role: RoleService
    ) {}

}

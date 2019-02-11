import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { RoleActions } from '../actions/role.actions';
import { RoleService } from '../../services/role.service';

@Injectable()
export class RoleEffects {

  // Listen for the 'ROLELIST_LOAD_START' action.
  @Effect() roleListAction$ = this._action$
      .pipe(
        ofType(RoleActions.ROLELIST_LOAD_START),
        switchMap<Action, any>(() => this._role.list()
          .pipe(
            // If successful, dispatch ROLELIST_LOAD_SUCCESS.
            map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLELIST_LOAD_SUCCESS, payload: _result }),
              // On errors dispatch ROLELIST_LOAD_FAILED action with result.
            catchError((res: any) => of({ type: RoleActions.ROLELIST_LOAD_FAILED, payload: res }))
          )
        )
      );

  // Listen for the 'PERMISSIONLIST_LOAD_START' action.
  @Effect() permissionListAction$ = this._action$
    .pipe(
      ofType(RoleActions.PERMISSIONLIST_LOAD_START),
      switchMap<Action, any>(() => this._role.getPermissions()
        .pipe(
          // If successful, dispatch PERMISSIONLIST_LOAD_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: RoleActions.PERMISSIONLIST_LOAD_SUCCESS, payload: _result }),
            // On errors dispatch PERMISSIONLIST_LOAD_FAILED action with result.
          catchError((res: any) => of({ type: RoleActions.PERMISSIONLIST_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'ROLE_LOAD_START' action.
  @Effect() roleLoadAction$ = this._action$
    .pipe(
      ofType(RoleActions.ROLE_LOAD_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: string) => this._role.get(payload)
        .pipe(
          // If successful, dispatch ROLE_LOAD_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_LOAD_SUCCESS, payload: _result }),
            // On errors dispatch ROLE_LOAD_FAILED action with result.
          catchError((res: any) => of({ type: RoleActions.ROLE_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'ROLE_CREATE_START' action.
  @Effect() roleCreateAction$ = this._action$
    .pipe(
      ofType(RoleActions.ROLE_CREATE_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._role.create(payload)
        .pipe(
          // If successful, dispatch ROLE_CREATE_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_CREATE_SUCCESS, payload: _result }),
            // On errors dispatch ROLE_CREATE_FAILED action with result.
          catchError((res: any) => of({ type: RoleActions.ROLE_CREATE_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'ROLE_UPDATE_START' action.
  @Effect() roleUpdateAction$ = this._action$
    .pipe(
      ofType(RoleActions.ROLE_UPDATE_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._role.update(payload)
        .pipe(
          // If successful, dispatch ROLE_UPDATE_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_UPDATE_SUCCESS, payload: _result }),
            // On errors dispatch ROLE_UPDATE_FAILED action with result.
          catchError((res: any) => of({ type: RoleActions.ROLE_UPDATE_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'ROLE_REMOVE_START' action.
  @Effect() roleRemoveAction$ = this._action$
    .pipe(
      ofType(RoleActions.ROLE_REMOVE_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._role.remove(payload)
        .pipe(
          // If successful, dispatch ROLE_REMOVE_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: RoleActions.ROLE_REMOVE_SUCCESS, payload: _result }),
            // On errors dispatch ROLE_REMOVE_FAILED action with result.
          catchError((res: any) => of({ type: RoleActions.ROLE_REMOVE_FAILED, payload: res }))
        )
      )
    );

  constructor(
    private readonly _action$: Actions,
    private readonly _role: RoleService
  ) {}

}

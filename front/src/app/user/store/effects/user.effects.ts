import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { mergeMap, map, withLatestFrom, switchMap, catchError, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { AppActions } from '../../../../core/store';
import { UserActions } from '../actions/user.actions';
import { UserService } from '../../services/user.service';
import { PagerService } from '../../../../core/services/pager.service';
import { Range } from '../../../../core/models/range';
import { User } from '../../../../core/models/user';

@Injectable()
export class UserEffects {

  private currentUser: User;

  // Listen for the 'USERLIST_LOAD_START' action.
  @Effect() userListAction$ = this._action
    .pipe(
      ofType(UserActions.USERLIST_LOAD_START),
      withLatestFrom(this._store),
      map(([action, storeState]) => {
        // If action payload is empty, get the previous pageIndex and pageSize to set the payload.
        if (!action.hasOwnProperty('payload') || !(action as any).payload) {
          const usersList = (storeState as any).usersList;
          (action as any).payload = {
            range: this._pagerService.getRange(usersList ? usersList.range : null),
            filter: usersList ? usersList.filter : null,
            sort: usersList ? usersList.sort : null
          };
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
  @Effect() userChangePageAction$ = this._action
    .pipe(
      ofType(UserActions.USERLIST_CHANGE_PAGE),
      map<Action, any>((action: Action) => (action as any).payload),
      map((payload: any) => {
        // dispatch USERLIST_LOAD_START and return USERLIST_CHANGE_PAGE_SUCCESS.
        this._store.dispatch(UserActions.list(payload));
        return <Action>{ type: UserActions.USERLIST_CHANGE_PAGE_SUCCESS, payload };
      })
    );

  // Listen for the 'USERS_LOAD_START' action.
  @Effect() userAllAction$ = this._action
    .pipe(
      ofType(UserActions.USERS_LOAD_START),
      switchMap(() => this._user.all()
        .pipe(
          // If successful, dispatch USERS_LOAD_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USERS_LOAD_SUCCESS, payload: _result }),
          // On errors dispatch USERS_LOAD_FAILED action with result.
          catchError((res: any) => of({ type: UserActions.USERS_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'USERS_GETLIKE_START' action
  @Effect() userGetLikeAction$ = this._action
    .pipe(
      ofType(UserActions.USERS_GETLIKE_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: string) => this._user.getLike(payload)
        .pipe(
          // If successful, dispatch USERS_GETLIKE_SUCCESS
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USERS_GETLIKE_SUCCESS, payload: _result }),
          // On errors dispatch USERS_GETLIKE_FAILED action with result
          catchError((res: any) => of({ type: UserActions.USERS_GETLIKE_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'USER_LOAD_START' action.
  @Effect() userLoadAction$ = this._action
    .pipe(
      ofType(UserActions.USER_LOAD_START),
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

  // Listen for the 'PROFILE_LOAD_START' action.
  @Effect() userProfileLoadAction$ = this._action
    .pipe(
      ofType(UserActions.PROFILE_LOAD_START),
      switchMap(() => this._user.getProfile()
        .pipe(
          // If successful, dispatch PROFILE_LOAD_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: UserActions.PROFILE_LOAD_SUCCESS, payload: _result }),
          // On errors dispatch PROFILE_LOAD_FAILED action with result.
          catchError((res: any) => of({ type: UserActions.PROFILE_LOAD_FAILED, payload: res }))
        )
      )
    );

  // Listen for the 'USER_CREATE_START' action.
  @Effect() userCreateAction$ = this._action
    .pipe(
      ofType(UserActions.USER_CREATE_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._user.create(payload)
        .pipe(
          // If successful, dispatch USER_CREATE_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_CREATE_SUCCESS, payload: _result }),
            // On errors dispatch USER_CREATE_FAILED action with result.
          catchError((res: any) => of({ type: UserActions.USER_CREATE_FAILED, payload: res })),
          // Dispatch UserActions.list() to update the list of users.
          tap((action) => {
            if (action.type === UserActions.USER_CREATE_SUCCESS) {
              this._store.dispatch(UserActions.list());
            }
          })
        )
      )
    );

  // Listen for the 'USER_UPDATE_START' action.
  @Effect() userUpdateAction$ = this._action
    .pipe(
      ofType(UserActions.USER_UPDATE_START),
      withLatestFrom(this._store),
      map(([action, storeState]) => {
        // Get current user
        this.currentUser = (storeState as any).currentUser;
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
              const profileUpdateSuccess = <Action>{ type: UserActions.PROFILE_UPDATE_SUCCESS, payload: _result };
              return from([userUpdateSuccess, profileUpdateSuccess]);
            }
            return from([userUpdateSuccess]);
          }),
          // On errors dispatch USER_UPDATE_FAILED action with result
          catchError((res: any) => of({ type: UserActions.USER_UPDATE_FAILED, payload: res })),
          // Dispatch UserActions.list() to update the list of users and redirect to user (only for user/edit) if profile is on success.
          tap((action) => {
            if (action.type === UserActions.PROFILE_UPDATE_SUCCESS || action.type === UserActions.USER_UPDATE_SUCCESS) {
              this._store.dispatch(UserActions.list());
            }
          })
        )
      )
    );

  // Listen for the 'PROFILE_UPDATE_START' action.
  @Effect() profileUpdateAction$ = this._action
    .pipe(
      ofType(UserActions.PROFILE_UPDATE_START),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: any) => this._user.updateProfile(payload)
        .pipe(
          // If successful, dispatch PROFILE_UPDATE_SUCCESS.
          map<Action, any>((_result: any) => <Action>{ type: UserActions.PROFILE_UPDATE_SUCCESS, payload: _result }),

          // On errors dispatch PROFILE_UPDATE_FAILED action with result
          catchError((res: any) => of({ type: UserActions.PROFILE_UPDATE_FAILED, payload: res })),
          // Dispatch UserActions.list() to update the list of users and redirect to user/edit).
          tap((action) => {
            if (action.type === UserActions.PROFILE_UPDATE_SUCCESS) {
              this._store.dispatch(UserActions.list());
            }
            this._router.navigate([environment.homepage]);
          })
        )
      )
    );

    // Listen for the 'USER_REMOVE_START' action.
    @Effect() userRemoveAction$ = this._action
      .pipe(
        ofType(UserActions.USER_REMOVE_START),
        map<Action, any>((action: Action) => (action as any).payload),
        switchMap((payload: string) => this._user.remove(payload)
          .pipe(
            // If successful, dispatch USER_REMOVE_SUCCESS.
            map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_REMOVE_SUCCESS, payload: _result }),
              // On errors dispatch USER_REMOVE_FAILED action with result.
            catchError((res: any) => of({ type: UserActions.USER_REMOVE_FAILED, payload: res })),
            // Dispatch UserActions.list() to update the list of users.
            tap((action) => {
              if (action.type === UserActions.USER_REMOVE_SUCCESS) {
                this._store.dispatch(UserActions.list());
              }
            })
          )
        )
      );

    // Listen for the 'USER_RESET_START' action.
    @Effect() userResetAction$ = this._action
      .pipe(
        ofType(UserActions.USER_RESET_START),
        map<Action, any>((action: Action) => (action as any).payload),
        switchMap((payload: string) => this._user.reset(payload)
          .pipe(
            // If successful, dispatch USER_RESET_SUCCESS.
            map<Action, any>((_result: any) => <Action>{ type: UserActions.USER_RESET_SUCCESS, payload: _result }),
              // On errors dispatch USER_RESET_FAILED action with result.
            catchError((res: any) => of({ type: UserActions.USER_RESET_FAILED, payload: res })),
            // Dispatch UserActions.list() to update the list of users.
            tap((action) => {
              if (action.type === UserActions.USER_RESET_SUCCESS) {
                this._store.dispatch(<Action>AppActions.setMessage({
                  title: 'Réinitialiser l\'authentification d\'un utilisateur',
                  message: 'Un e-mail a été envoyé à l\'utilisateur pour la réinitialisation de son compte.'
                }));
              }
            })
          )
        )
      );

    constructor(
      private readonly _action: Actions,
      private readonly _user: UserService,
      private readonly _router: Router,
      private readonly _store: Store<Action>,
      private readonly _pagerService: PagerService,
    ) {}

}

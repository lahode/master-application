import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import * as _ from 'lodash';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';

import { AppActions } from '../actions/app.actions';
import { AuthActions } from '../../../app/auth/store/actions/auth.actions';
import { AuthService } from '../../../app/auth/services/auth.service';
import { MenuLink } from '../../models/menu-link';

@Injectable()
export class MenuLinksEffects {

  // Listen for the 'CHECK_AUTH_START' action
  @Effect() MenuLinksAction$ = this.action$
    .pipe(
      ofType(AuthActions.CHECK_AUTH_START),
      switchMap(() => this._auth.checkAuth()
        .pipe(
          map<Action, any>((_result: any) => {
            if (_result) {
              const menuLinks: MenuLink[] = [
                { label: 'Home', path: `/home`, icon: 'home' },
                // { label: 'Hello world', path: `/test`, icon: 'people', permissions: ['xxx'] },
              ];

              // Check permissions on each menu links.
              let menuLinksFiltered = menuLinks;
              if (_result.roles.length > 0) {
                menuLinksFiltered = menuLinks.filter(ml => {
                  if (ml.permissions && ml.permissions.length > 0) {
                    return _result.roles.filter(r => r.role.permissions.filter(p => ml.permissions.includes(p)).length === 0).length === 0;
                  } else {
                    return true;
                  }
                });
              }
              return <Action>{ type: AppActions.SETMENU, payload: menuLinksFiltered };
            } else {
              return <Action>{ type: AppActions.SETMENU, payload: null };
            }
          }),
          catchError(() => {
            return of({ type: AppActions.SETMENU, payload: null });
          })
        )
      )
    );

  constructor(
    private readonly action$: Actions,
    private readonly _auth: AuthService,
  ) {}

}

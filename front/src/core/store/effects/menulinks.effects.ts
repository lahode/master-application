import { Injectable } from '@angular/core';
import { of } from 'rxjs';
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
      switchMap(() => this._auth.checkAuth(false)
        .pipe(
          map<Action, any>((_result: any) => {
            if (_result) {
              const menuLinks: MenuLink[] = [
                { label: 'Home', path: `/home`, icon: 'home' },
              ];
              return <Action>{ type: AppActions.SETMENU, payload: menuLinks };
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

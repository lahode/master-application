import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { NavigationService } from '../../services/navigation.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class PreviousNavigationEffects {

  // Listen for the 'CHECK_AUTH_START' action
  @Effect() PreviousNavigationAction$ = this.action$
    .pipe(
      ofType('@ngrx/router-store/navigation'),
      map<Action, any>((action: Action) => (action as any).payload),
      switchMap((payload: string) => this._navigation.setPreviousNavigation(payload['routerState'])
        .pipe(
          map<Action, any>((_result: any) => {
            return <Action>{ type: 'PREVIOUS_NAVIGATION', payload: null };
          })
        )
      )
    );

  constructor(private readonly action$: Actions,
              private readonly _navigation: NavigationService) {}

}

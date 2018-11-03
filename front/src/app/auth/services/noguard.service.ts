import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { AuthActions } from '../store';

@Injectable()
export class NoGuard implements CanActivate {

  constructor(private readonly _router: Router,
              private readonly _store: Store<any>) {}

    canActivate(): Observable<boolean> {
      // Dispatch check auth action
      this._store.dispatch(<Action>AuthActions.checkAuth());
      // Check Auth on store select
      return this._store.select(state => state)
        .pipe(
          filter((state) => state.loading.length === 0),
          map((state) => {
            if (state.currentUser === null) {
              return true;
            }
            this._router.navigate(['/home']);
            return false;
          }),
          take(1)
        );
  }
}

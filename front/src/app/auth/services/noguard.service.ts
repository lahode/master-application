import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { AuthActions } from '../store';
import { environment } from '../../../environments/environment';

@Injectable()
export class NoGuard implements CanActivate {

  constructor(private readonly _router: Router,
              private readonly _store: Store<any>) {}

    canActivate(): Observable<boolean> {
      // Dispatch check auth action
      this._store.dispatch(<Action>AuthActions.checkAuth()); // TODO: Can't we put it in the interceptor???

      // Check Auth on store select
      return this._store.select(state => state)
        .pipe(
          filter((state) => state.loading.length === 0),
          map((state) => {
            // Allow access if currentUser does not exist.
            if (state.currentUser === null) {
              return true;
            }
            // Else redirect to home page.
            this._router.navigate([environment.homepage]);
            return false;
          }),
          take(1)
        );
  }
}

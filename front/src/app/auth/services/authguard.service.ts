import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { AuthActions } from '../store';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly _router: Router,
              private readonly _store: Store<any>) {}

    canActivate(route: ActivatedRouteSnapshot,
                routerState: RouterStateSnapshot): Observable<boolean> {
      // Manage redirect link
      const path = routerState.url.indexOf('?') > 0 ? routerState.url.substring(0, routerState.url.indexOf('?')).slice(1)
                   : routerState.url.slice(1);
      const queryParams = path.length > 0 ? { queryParams: { returnUrl: path }} : {};

      // Dispatch check auth action
      this._store.dispatch(<Action>AuthActions.checkAuth());

      // Dispatch check permissions action
      const permissions = route.data['perms'];
      this._store.dispatch(<Action>AuthActions.checkPermission(permissions));

      // Check Auth on store select
      return this._store.select(state => state)
        .pipe(
          filter((state) => state.loading.length === 0),
          map((state) => {
            if (state.authCheck && state.permissionCheck) {
              return true;
            }
            this._router.navigate(['/signin'], queryParams);
            return false;
          }),
          take(1)
        );
  }
}

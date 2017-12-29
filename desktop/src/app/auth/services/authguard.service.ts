import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store, Action } from '@ngrx/store';
import { AuthActions } from '../store';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly router: Router,
              private readonly store: Store<any>) {}

    canActivate(route: ActivatedRouteSnapshot,
                routerState: RouterStateSnapshot): Observable<boolean> {
      const path = routerState.url.substring(0, routerState.url.indexOf('?'));
      const queryParams = Object.keys(routerState.root.queryParams).length > 0 ? { queryParams: routerState.root.queryParams }
       : (path ? { queryParams: { returnUrl: path }} : {}) ;
      this.store.dispatch(<Action>AuthActions.checkAuth());
      return this.store.select(state => state)
        .filter((state) => !state.loading)
        .map((state) => {
          if (state.currentUser !== null) {
            return true;
          }
          this.router.navigate(['/signin'], queryParams);
          return false;
        }).take(1);
  }
}

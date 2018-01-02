import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store, Action } from '@ngrx/store';
import { AuthActions } from '../store';

@Injectable()
export class NoGuard implements CanActivate {

  constructor(private readonly router: Router,
              private readonly store: Store<any>) {}

    canActivate(route: ActivatedRouteSnapshot,
                routerState: RouterStateSnapshot): Observable<boolean> {
      // Dispatch check auth action
      this.store.dispatch(<Action>AuthActions.checkAuth());
      // Check Auth on store select
      return this.store.select(state => state)
        .filter((state) => state.loading.length === 0)
        .map((state) => {
          if (state.currentUser === null) {
            return true;
          }
          this.router.navigate(['/']);
          return false;
        }).take(1);
  }
}

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
                state: RouterStateSnapshot): Observable<boolean> {
      this.store.dispatch(<Action>AuthActions.checkAuth());
      return this.store.select(state => state)
        .filter((state) => !state.loading)
        .map((state) => {
          if (state.currentUser !== null) {
            return true;
          }
          this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
          return false;
        }).take(1);
  }
}

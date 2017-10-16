import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { AuthStateI } from '../store';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<any>,
    private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    return this.store
      .select((authState: AuthStateI) => authState.currentUser)
      .map(user => {
        if (!user) {
          this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
          return false;
        }
        return true;
      });
  }
}

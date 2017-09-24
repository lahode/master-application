/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   21-09-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 21-09-2017
 */

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { AppStateI } from '../../app-state-module';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<any>,
    private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    /**
     * Code repris de https://github.com/ngrx/platform/blob/master/example-app/app/auth/services/auth-guard.service.ts
     *
    return this.store
      .select((appState: AppStateI) => appState.getLoggedIn)
      .map(user => {
        if (!user) {
          this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
          return false;
        }

        return true;
      })
      .take(1);
    */
    this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

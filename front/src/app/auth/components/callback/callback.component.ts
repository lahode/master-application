import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { StorageService } from '../../../../core/services/storage.service';
import { User } from '../../../../core/models/user';
import { AppActions } from '../../../../core/store';
import { environment } from '../../../../environments/environment';

const RESETAUTH = 'reset_auth';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallbackComponent implements AfterViewInit {
  public color = 'primary';
  public mode = 'indeterminate';
  public value = 50;

  constructor(private readonly _auth: AuthService,
              private readonly _router: Router,
              private readonly _route: ActivatedRoute,
              private readonly _store: Store<any>,
              private readonly _storage: StorageService) { }

  ngAfterViewInit() {
    // Check if user is authentication on auth0.
    this._auth.handleAuthentication().then(() => {

      // Dispatch check callback action.
      this._auth.checkAuth().pipe(
        map((user: User) => {
          return {success: true, data: user};
        }),
        take(1),
        catchError(err => {
          return of({success: false, data: err});
        })
      ).subscribe(res => {
        if (res.success && !res.data) {
          this._logout();
        } else if (!res.success) {
          this._logout(res.data.message);
        } else if (res.success && res.data) {
          this._storage.remove(RESETAUTH).then(() => {
          const returnUrl = this._route.snapshot.queryParams['returnUrl'] || environment.homepage;
          this._store.dispatch(<Action>AppActions.setLanguage(res.data.language));
            this._router.navigate([`${returnUrl}`]);
          });
        }
      });

    // Redirect on signin page if an error has been found.
    }).catch((err) => this._logout(err));
  }

  private _logout(err = null) {
    this._auth.logout();
    if (err) {
      this._store.dispatch(<Action>AppActions.setError(err));
    }
    this._router.navigate(['/signin']);
  }

}

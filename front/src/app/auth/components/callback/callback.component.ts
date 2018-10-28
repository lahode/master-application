import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { AuthActions } from '../../store';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent {

  constructor(private readonly _auth: AuthService,
              private readonly _router: Router,
              private readonly _store: Store<any>) {

    if (this._auth.handleAuthentication()) {
      this._router.navigate(['/signin']);
    } else {
      console.log('before');
      // Dispatch check auth action
      // this._store.dispatch(<Action>AuthActions.checkAuth());
      console.log('after');

      this._store.select(state => state)
        .pipe(
          map((state) => {
            console.log('waiting', state);
            return state;
          }),
          filter((state) => state.loading.length === 0),
          map((state) => {
            console.log('callback', state);
            if (state.authCheck) {
              this._router.navigate(['/']);
            } else {
              this._router.navigate(['/register'], { queryParams: { auth: 'direct'} });
            }
          }),
          take(1)).subscribe();
    }
  }

}

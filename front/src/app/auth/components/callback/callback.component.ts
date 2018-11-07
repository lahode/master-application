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

    this._auth.handleAuthentication().then(result => {
      if (result) {
        this._router.navigate(['/signin']);
      } else {
        // Dispatch check callback action
        this._store.dispatch(<Action>AuthActions.callback());
      }
    }).catch(() => this._router.navigate(['/signin']));
  }

}

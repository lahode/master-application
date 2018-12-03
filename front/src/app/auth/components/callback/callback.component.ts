import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { AuthActions } from '../../store';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private readonly _auth: AuthService,
              private readonly _router: Router,
              private readonly _store: Store<any>) { }

  ngOnInit() {
    // Check if user is authentication on auth0.
    this._auth.handleAuthentication().then(() => {
      // Dispatch check callback action.
      this._store.dispatch(<Action>AuthActions.callback());
    // Redirect on signin page if an error has been found.
    }).catch(() => this._router.navigate(['/signin']));
  }

}

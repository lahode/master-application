import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../../store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private showBlock = 'login';
  private authType = '';

  constructor(private readonly _store: Store<any>) {}

  // Set authentication type.
  ngOnInit() {
    this.authType = environment.authentication.type;
  }

  // Change block tabulation.
  public onChangeBlock(block) {
    this.showBlock = block;
  }

  // Set direct login option (Not displaying username and password).
  public directLogin() {
    this._store.dispatch(<Action>AuthActions.login(null));
  }

}

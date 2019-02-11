import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Store, Action } from '@ngrx/store';
import { ActivatedRoute, Params} from '@angular/router';

import { AuthActions } from '../../store';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  public showBlock = 'login';
  public authType = '';

  constructor(private readonly _store: Store<any>,
              private readonly _storage: StorageService,
              private _router: ActivatedRoute) {}

  // Set authentication type.
  ngOnInit() {
    this.authType = environment.authentication.type;

    // Check if reset authentication has been set.
    this._router.queryParams.subscribe((params: Params) => {
      this._storage.set('reset_auth', params['connect']);
    });
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

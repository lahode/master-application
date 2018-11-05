import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params} from '@angular/router';

import { AuthActions } from '../../store';
import { DoubleValidation } from '../../../../core/services/custom-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;
  public loading$: Observable<any>;
  public directLogin = false;

  @Input() returnUrl: string;

  constructor(private _store: Store<any>,
              private readonly _fb: FormBuilder,
              private _router: ActivatedRoute) { }

  ngOnInit() {
    // Check if direct register has been set.
    this._router.queryParams.subscribe((params: Params) => {
      this.directLogin = params['auth'] === 'direct';
    });

    // Define email validation pattern
    const emailpattern = `[a-z0-9!#$%&'*+/=?^_"{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_"{|}~-]+)` +
                         `@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`;

    // Register form
    this.registerForm = this._fb.group({
      firstname: ['', [Validators.required, <any>Validators.minLength(2)]],
      lastname: ['', [Validators.required, <any>Validators.minLength(2)]],
      username: ['', !this.directLogin ? [Validators.required, <any>Validators.minLength(5)] : []],
      email: ['', [Validators.required, Validators.pattern(emailpattern)]],
      emailconfirm: ['', [Validators.required, Validators.pattern(emailpattern)]],
      password: ['', !this.directLogin ? Validators.required : []],
    }, {
      validator: DoubleValidation.MatchEmail
    });

    // Start loading
    this.loading$ = this._store.select(state => state.loading);
  }

  // Register the new user
  onRegister() {
    if (this.registerForm.valid) {
      this._store.dispatch(<Action>AuthActions.signup(this.registerForm.value));
      this.registerForm.controls['password'].reset();
    }
  }

}

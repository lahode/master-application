import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';
import { ActivatedRoute, Params} from '@angular/router';

import { AuthActions } from '../../store';
import { DoubleValidation } from '../../../../core/services/custom-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
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

    // Define email validation pattern.
    const emailpattern = `[a-z0-9!#$%&'*+/=?^_"{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_"{|}~-]+)` +
                         `@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`;

    // Initialze register form.
    this.registerForm = this._fb.group({
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      username: ['', [<any>Validators.minLength(4), <any>Validators.pattern('^[a-zA-Z0-9-]+$')]],
      email: ['', [<any>Validators.required, <any>Validators.pattern(emailpattern)]],
      emailconfirm: ['', [<any>Validators.required, <any>Validators.pattern(emailpattern)]],
      password: ['', !this.directLogin ? <any>Validators.required : []],
    }, {
      validator: DoubleValidation.MatchEmail
    });
  }

  // Register the new user.
  onRegister() {
    if (this.registerForm.valid) {
      delete(this.registerForm.value.emailconfirm);
      this._store.dispatch(<Action>AuthActions.signup(this.registerForm.value));
      this.registerForm.controls['password'].reset();
    }
  }

}

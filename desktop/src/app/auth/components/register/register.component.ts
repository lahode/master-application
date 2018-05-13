import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';

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

  @Input() returnUrl: string;

  constructor(private store: Store<any>,
              private readonly _fb: FormBuilder) { }

  ngOnInit() {
    // Define email validation pattern
    const emailpattern = `[a-z0-9!#$%&'*+/=?^_"{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_"{|}~-]+)` +
                         `@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`;

    // Register form
    this.registerForm = this._fb.group({
      fistname: ['', [Validators.required, <any>Validators.minLength(2)]],
      lastname: ['', [Validators.required, <any>Validators.minLength(2)]],
      username: ['', [Validators.required, <any>Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern(emailpattern)]],
      emailconfirm: ['', [Validators.required, Validators.pattern(emailpattern)]],
      password: ['', Validators.required],
    }, {
      validator: DoubleValidation.MatchEmail
    });

    // Start loading
    this.loading$ = this.store.select(state => state.loading);
  }

  // Register the new user
  onRegister() {
    if (this.registerForm.valid) {
      this.store.dispatch(<Action>AuthActions.signup(this.registerForm.value));
      this.registerForm.reset();
    }
  }

}

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../../store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;
  private loading;

  @Input() returnUrl: string;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    // Define email validation pattern
    let emailpattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

    // Register form
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      username: new FormControl(null, [
        Validators.required
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
      emailconfirm: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
      password: new FormControl(null, Validators.required)
    });
  }

  // Register the new user
  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.store.dispatch(<Action>AuthActions.signup(this.registerForm.value));
      this.registerForm.reset();
    }
  }

}

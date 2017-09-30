import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';

import { User } from '../user.model';
import { AuthActions } from '../../../core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private registerForm: FormGroup;
  private loading;
  private storeErrorSubscription$;

  @Input() returnUrl: string;

  constructor(private store: Store<any>,
              private authActions: AuthActions) { }

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

    // Disable spinner loader when complete
    this.storeErrorSubscription$ = this.store.select(state => state.loading);
    this.storeErrorSubscription$.subscribe(loading => {
      console.log(loading)
      if (loading) {
        this.loading = false;
      }
    });
  }

  // Register the new user
  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      const newUser = new User(this.registerForm.value.username, this.registerForm.value.password,
                            this.registerForm.value.name, this.registerForm.value.email);
      this.store.dispatch(<Action>this.authActions.signup(newUser));
      this.registerForm.reset();
    }
  }

  ngOnDestroy() {
    //this.storeErrorSubscription$.unsubscribe();
  }

}

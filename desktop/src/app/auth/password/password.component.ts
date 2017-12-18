import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../store';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {

  public passwordForm: FormGroup;
  public loading;
  private storeErrorSubscription;
  @Output() alertReceived = new EventEmitter();
  @Output() changeBlock = new EventEmitter();

  constructor(private store: Store<any>) { }

  ngOnInit() {
    // Define email validation pattern
    let emailpattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

    // Password request form
    this.passwordForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
    });

    // Managing error in app
    this.storeErrorSubscription = this.store.select(state => state.error).subscribe(error => {
      if (error) {
        console.log('Ca ne fonctionne qu une fois, pourquoi?');
        this.loading = false;
      }
    });
  }

  // Request a new password
  onRequestPassword() {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.store.dispatch(<Action>AuthActions.getPassword(this.passwordForm.value));
      this.passwordForm.reset();
    }
  }

  ngOnDestroy() {
    this.storeErrorSubscription.unsubscribe();
  }

}

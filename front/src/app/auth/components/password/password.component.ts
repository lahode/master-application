import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions } from '../../store';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  public passwordForm: FormGroup;
  @Output() alertReceived = new EventEmitter();
  @Output() changeBlock = new EventEmitter();

  constructor(private _store: Store<any>) { }

  ngOnInit() {
    // Define email validation pattern.
    const emailpattern = `[a-z0-9!#$%&'*+/=?^_"{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_"{|}~-]+)` +
                         `@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`;

    // Initialze password request form.
    this.passwordForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
    });
  }

  // Request a new password.
  onRequestPassword() {
    if (this.passwordForm.valid) {
      this._store.dispatch(<Action>AuthActions.getPassword(this.passwordForm.value));
      this.passwordForm.reset();
    }
  }

}

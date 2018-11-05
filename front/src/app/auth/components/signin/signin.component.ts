import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions } from '../../store';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @Input() returnUrl: string;
  @Output() changeBlock = new EventEmitter();

  public signInform: FormGroup;
  public loading$: Observable<any>;

  constructor(private readonly _store: Store<any>,
              private readonly _fb: FormBuilder) {}

  ngOnInit() {
    // Authenticate form
    this.signInform = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Start loading
    this.loading$ = this._store.select(state => state.loading);
  }

  // Change block
  public onRedirectPassword(event) {
    // Prevent mouse click triggered when hitting Enter on the form.
    if (event.clientX === 0 && event.clientY === 0) {
      this.onSignIn();
    } else {
      this.changeBlock.emit('password');
    }
  }

  // Sign in the user
  onSignIn() {
    if (this.signInform.valid) {
      this._store.dispatch(<Action>AuthActions.login(this.signInform.value));
      this.signInform.reset();
    }
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../../store';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public signInform: FormGroup;
  public loading$;

  @Input() returnUrl: string;
  @Output() changeBlock = new EventEmitter();

  constructor(private readonly store: Store<any>,
              private readonly _fb: FormBuilder) {}

  ngOnInit() {
    // Authenticate form
    this.signInform = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Start loading
    this.loading$ = this.store.select(state => state.loading)
  }

  // Change block
  public onChangeBlock(block) {
    this.changeBlock.emit('password');
  }

  // Sign in the user
  onSignIn() {
    if (this.signInform.valid) {
      this.store.dispatch(<Action>AuthActions.login(this.signInform.value));
      this.signInform.reset();
    }
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';

import { User } from '../user.model';
import { AuthActions } from '../store';

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

  constructor(private store: Store<any>) { }

  ngOnInit() {
    // Authenticate form
    this.signInform = new FormGroup({
      username: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, Validators.required)
    });
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

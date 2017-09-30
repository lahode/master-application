import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';

import { User } from '../user.model';
import { AuthActions } from '../../../core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {

  public signInform: FormGroup;
  public loading;
  private storeErrorSubscription$;

  @Input() returnUrl: string;
  @Output() changeBlock = new EventEmitter();

  constructor(private store: Store<any>,
              private authActions: AuthActions) { }

  ngOnInit() {
    // Authenticate form
    this.signInform = new FormGroup({
      username: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, Validators.required)
    });

    // Disable spinner loader when complete
    this.storeErrorSubscription$ = this.store.select(state => state.loading);
    this.storeErrorSubscription$.subscribe(loading => {
      console.log(loading)
      if (!loading) {
        this.loading = false;
      }
    });
  }

  // Change block
  public onChangeBlock(block) {
    this.changeBlock.emit('password');
  }

  // Sign in the user
  onSignIn() {
    if (this.signInform.valid) {
      this.loading = true;
      this.store.dispatch(<Action>this.authActions.login(this.signInform.value));
      this.signInform.reset();
    }
  }

  // Destroy store subscription when leaving component
  ngOnDestroy() {
    //this.storeErrorSubscription$.unsubscribe();
  }

}

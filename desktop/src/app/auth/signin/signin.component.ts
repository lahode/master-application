import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Action } from '@ngrx/store';

import { User } from '../user.model';
import { AuthActions } from '../../../core';

import { MessageService } from '../../message/message.service';

@Component({
  selector: 'ob-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public signInform: FormGroup;
  public loading;
  public storeLogin;

  @Input() returnUrl: string;
  @Output() changeBlock = new EventEmitter();

  constructor(private store: Store<any>,
              private authActions: AuthActions,
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit() {
    // Authenticate form
    this.signInform = new FormGroup({
      username: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, Validators.required)
    });

/*
    this.storeLogin = this.store.select(state => state.auth.authCheck);
    this.storeLogin.subscribe(authCheck => {
      console.log(authCheck)
    });
*/
  }

  // Change block
  public onChangeBlock(block) {
    this.changeBlock.emit('password');
  }

  // Sign in the user
  onSignIn() {
    this.loading = true;
    const user = new User(this.signInform.value.username, this.signInform.value.password);
    this.store.dispatch(<Action>this.authActions.login(this.signInform));
    /*
    this.authService.signin(user)
      .subscribe(
        () => this.router.navigate([this.returnUrl]),
        err => {
          this.messageService.error(err);
          this.loading = false;
        }
      );
    this.signInform.reset();
    */
  }

}

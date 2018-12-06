import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { AuthActions } from '../../store';
import { DoubleValidation } from '../../../../core/services/custom-validation';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetComponent implements OnInit {

  public passwordResetForm: FormGroup;
  private initToken: string;

  constructor(private _store: Store<any>,
              private readonly _fb: FormBuilder,
              private _route: Router,
              private _router: ActivatedRoute) { }

  ngOnInit() {
    // Check if direct register has been set.
    this._router.queryParams.subscribe((params: Params) => {
      this.initToken = params['reset'];
      if (!this.initToken) {
        this._route.navigate(['/signin']);
      }
    });

    // Initialze register form.
    this.passwordResetForm = this._fb.group({
      passwordnew: ['', Validators.required],
      passwordconfirm: ['', Validators.required]
    }, {
      validator: DoubleValidation.MatchPassword
    });
  }

  // Register the new user.
  onReset() {
    if (this.passwordResetForm.valid) {
      this._store.dispatch(<Action>AuthActions.resetPassword({password: this.passwordResetForm.value.passwordnew, token: this.initToken}));
      this.passwordResetForm.reset();
    }
  }

}

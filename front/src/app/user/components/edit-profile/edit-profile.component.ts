import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { User } from '../../../../core/models/user';
import { PictureEditComponent } from '../../../shared/components/picture-edit/picture-edit.component';
import { DoubleValidation } from '../../../../core/services/custom-validation';
import { UserActions } from '../../../user/store';
import { FileService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public user$: Observable<any>;
  public editProfileform: FormGroup;
  private userEdit: User;
  public picture: any;
  public picture$: Observable<any>;
  private enableAuthChange = false;

  constructor(private readonly _store: Store<any>,
              private readonly _router: Router,
              private readonly _dialog: MatDialog,
              private readonly _fb: FormBuilder,
              private readonly _file: FileService) { }

  ngOnInit() {
    this.editProfileform = this._fb.group({
      _id: [''],
      username: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      description: [''],
      passwordcurrent: [''],
      passwordnew: [''],
      passwordconfirm: ['']
    }, {
      validator: DoubleValidation.MatchPassword
    });

    // Get connected user and current user edit to fill the form.
    this.user$ = this._store.select(state => state)
      .pipe(
        filter((state) => state.loading.length === 0),
        map(state => {
          // Set user data to user form or reset users form.
          this.userEdit = state.currentUser;
          this.picture = state.currentUser ? state.currentUser.picture : null;
          if (this.picture) {
            this.picture$ = this._file.view(this.picture);
          }
          const tokenCheck = this.userEdit['sub'].split('|');
          if (tokenCheck.length === 2 && tokenCheck[0]) {
            const tokenType = tokenCheck[0].split('-');
            this.enableAuthChange = tokenType.length === 2 && tokenType[0] === 'token' ? true : false;
          }
          if (Object.keys(this.userEdit).length > 0) {
            Object.keys(this.userEdit).forEach(key => {
              if (this.editProfileform.controls.hasOwnProperty(key)) {
                this.editProfileform.controls[key].setValue(this.userEdit[key]);
              }
            });
          }
          return this.userEdit;
        })
      );
  }

  // Cancel the changes.
  cancel(): void {
    this._router.navigate(['/user']);
  }

  editPicture() {
    const dialogRef = this._dialog.open(PictureEditComponent, {
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.picture = result;
        this.picture$ = this._file.view(result);
      }
    });
  }

  // Save the user form.
  save(): void {
    const model = this.editProfileform.value;

    // Set form updates to the original user object.
    if (this.userEdit) {
      Object.keys(this.userEdit).map(key => {
        if (!model.hasOwnProperty(key)) {
          model[key] = this.userEdit[key];
        }
      });
    }
    delete(model.passwordconfirm);
    if (this.picture) {
      model.picture = this.picture;
    }
    this.userEdit = model;

    // Update the user
    this._store.dispatch(<Action>UserActions.update(this.userEdit));
  }

}

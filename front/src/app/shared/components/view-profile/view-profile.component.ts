import { Component, ChangeDetectionStrategy, Inject, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UserActions } from '../../../user/store';
import { FileService } from '../../../../core/services/file.service';

import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewProfileComponent implements OnInit {

  public user$: Observable<any>;
  public picture$: Observable<any>;
  public canEdit = false;

  constructor(private readonly _dialogRef: MatDialogRef<ViewProfileComponent>,
              private readonly _store: Store<any>,
              private readonly _file: FileService,
              private readonly _router: Router,
              @Inject(MAT_DIALOG_DATA) public userID: any) {}

  ngOnInit() {
    // Load all activities from course.
    if (this.userID) {
      this._store.dispatch(<Action>UserActions.load(this.userID));
    }

    // Get the current user.
    this.user$ = this._store.select(state => state)
      .pipe(
        map(state => {
          let user: User;
          const currentUser = state.currentUser;

          if (!this.userID || this.userID === currentUser._id) {
            user = currentUser;
            this.canEdit = true;
          } else {
            user = state.userEdit;
          }

          // Get the current user picture.
          if (user) {
            this.picture$ = user.picture ? this._file.view(user.picture) : null;
          }
          return user;
        })
      );
  }

  // Navigate to Edit profile page.
  public editProfile() {
    this._router.navigate([`/user/edit`]);
    this._dialogRef.close();
  }

}

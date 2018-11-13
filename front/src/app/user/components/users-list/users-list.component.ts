import { Component, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../../../core/models/user';
import { Range } from '../../../../core/models/range';
import { UserActions } from '../../store';
import { UsersEditComponent } from '../../../shared/components/users-edit/users-edit.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  users$: Observable<User[]>;
  total: number;
  pageIndex = 0;
  pageSize = 10;

  constructor(private readonly _store: Store<any>,
              private readonly _dialog: MatDialog) {
    // Retrieve the list of current users pagination.
    this.users$ = this._store.select(state => state.usersList).pipe(
      map(userList => {
        if (userList) {
          this.total = userList.total;
          this.pageIndex = userList.pageIndex;
          this.pageSize = userList.pageSize;
          return userList.items;
        }
      })
    );
  }

  ngOnInit() {
    // Dispatch the list of roles.
    const range = <Range>{from: this.pageIndex * this.pageSize, to: ((this.pageIndex + 1) * this.pageSize) - 1};
    this._store.dispatch(<Action>UserActions.list(range));
  }

  // Change the page on the pagination.
  changePage(event) {
    this._store.dispatch(<Action>UserActions.changePage(event));
  }

  // Dispatch the new or existing roles and open the modal to create/edit it.
  manageUser(userID: string = null) {
    if (userID) {
      this._store.dispatch(<Action>UserActions.load(userID));
    } else {
      this._store.dispatch(<Action>UserActions.new());
    }
    const dialogRef = this._dialog.open(UsersEditComponent, {
      width: '75%',
    });
    dialogRef.disableClose = true;
  }

  // Delete an existing user.
  deleteUser(user: User) {
    const confirmMessage = {
      title: 'USERS.DELETE.TITLE',
      message: 'USERS.DELETE.MESSAGE',
      name: user.username,
      action: <Action>UserActions.remove(user._id)
    };
    this._store.dispatch(<Action>UserActions.confirm(confirmMessage));
  }

}

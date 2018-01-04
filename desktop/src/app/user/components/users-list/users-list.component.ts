import { Component, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { User } from '../../models/user';
import { Range } from 'core/models/range';
import { UserActions } from '../../store';
import { UsersEditComponent } from '../users-edit/users-edit.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  users: User[];
  total: number;
  pageIndex = 0;
  pageSize = 10;

  constructor(private readonly store: Store<any>,
              private readonly dialog: MatDialog,
              private readonly router: Router) {
    this.store.select(state => state.usersList)
    .subscribe(userList => {
      if (userList) {
        this.users = userList.items;
        this.total = userList.total;
        this.pageIndex = userList.pageIndex;
        this.pageSize = userList.pageSize;
      }
    });
  }

  ngOnInit() {
    const range = <Range>{from: this.pageIndex * this.pageSize, to: ((this.pageIndex + 1) * this.pageSize) - 1}
    this.store.dispatch(<Action>UserActions.list(range));
  }

  changePage(event) {
    this.store.dispatch(<Action>UserActions.changePage(event));
  }

  manageUser(userID: string = null) {
    if (userID) {
      this.store.dispatch(<Action>UserActions.load(userID));
    } else {
      this.store.dispatch(<Action>UserActions.new());
    }
    const dialogRef = this.dialog.open(UsersEditComponent, {
      width: '75%',
    });
    dialogRef.disableClose = true;
  }

  deleteUser(user: User) {
    const confirmMessage = {
      title: 'USERS.DELETE.TITLE',
      message: 'USERS.DELETE.MESSAGE',
      name: user.username,
      action: <Action>UserActions.remove(user._id)
    }
    this.store.dispatch(<Action>UserActions.confirm(confirmMessage));
  }

}

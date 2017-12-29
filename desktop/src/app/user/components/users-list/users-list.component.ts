import { Component, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { User } from '../../models/user';
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

  constructor(private readonly store: Store<any>,
              private readonly dialog: MatDialog,
              private readonly router: Router) {
    this.store.select(state => state.userList).subscribe(userList => {
      this.users = userList.users;
      this.total = userList.total;
    });
  }

  ngOnInit() {
    this.store.dispatch(<Action>UserActions.list());
  }

  showUserDetail(user: User) {
    this.router.navigate([`/user/view/${user._id}`]);
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

  deleteUser(userID: string) {
    this.store.dispatch(<Action>UserActions.remove(userID));
  }

}

import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../../../core/models/user';
import { UserActions } from '../../store';
import { UsersEditComponent } from '../../../shared/components/users-edit/users-edit.component';
import { PagerService } from '../../../../core/services/pager.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {

  public users$: Observable<User[]>;
  public fields: string[] = ['username', 'actions'];
  public statusList: Array<string> = ['Désactivé', 'Actif'];
  public filterableFields = Array.from(filterable);
  public pageRange: any;
  public pageFilter: any;
  public pageSort: any;

  constructor(private readonly _store: Store<any>,
              private readonly _pager: PagerService,
              private readonly _dialog: MatDialog) {}

  ngOnInit() {
    this._store.dispatch(<Action>UserActions.list());

    // Initialize the list of users.
    this.users$ = this._store.select(state => state.usersList)
      .pipe(
        map(users => {
          if (users) {
            this.pageRange =  this._pager.getRange(users.range, users.total);
            this.pageFilter = users.filter || {field: 'username', value: ''};
            this.pageSort = users.sort || {active: 'username', direction: 'asc'};
            return users.items;
          }
        })
      );
  }

  // Update the list of users.
  updateList(type, event = null) {
    switch (type) {
      case 'filterField' :
        this.pageFilter = { field: event, value : '' };
        break;
      case 'filterValue' :
        this.pageFilter = { field: this.pageFilter.field, value : event };
        break;
      case 'sort' :
        this.pageSort = event;
        break;
      case 'pager' :
        this.pageRange = event;
        break;
    }
    this._store.dispatch(<Action>UserActions.changePage({
      range: this.pageRange,
      filter: this.pageFilter,
      sort: this.pageSort
    }));
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

const filterable = new Map();
filterable.set('username', 'Username');
filterable.set('active', 'Statut');

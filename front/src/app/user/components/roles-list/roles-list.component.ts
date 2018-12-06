import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Role } from '../../../../core/models/role';
import { RoleActions } from '../../store';
import { RolesEditComponent } from '../../../shared/components/roles-edit/roles-edit.component';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesListComponent implements OnInit {

  roles$: Observable<Role[]>;

  constructor(private readonly _store: Store<any>,
              private readonly _dialog: MatDialog) {
    // Retrieve the list of every roles.
    this.roles$ = this._store.select(state => state.rolesList).pipe(
      map(roleList => {
        if (Object.keys(roleList).length > 0) {
          return roleList;
        }
      })
    );
  }

  ngOnInit() {
    // Dispatch the list of roles.
    this._store.dispatch(<Action>RoleActions.list());
  }

  // Dispatch the new or existing roles and open the modal to create/edit it.
  manageRole(roleID: string = null) {
    if (roleID) {
      this._store.dispatch(<Action>RoleActions.load(roleID));
    } else {
      this._store.dispatch(<Action>RoleActions.new());
    }
    const dialogRef = this._dialog.open(RolesEditComponent, {
      width: '75%',
    });
    dialogRef.disableClose = true;
  }

  // Delete an existing role.
  deleteRole(role: Role) {
    const confirmMessage = {
      title: 'USERS.DELETE.TITLE',
      message: 'USERS.DELETE.MESSAGE',
      name: role.name,
      action: <Action>RoleActions.remove(role._id)
    };
    this._store.dispatch(<Action>RoleActions.confirm(confirmMessage));
  }

}

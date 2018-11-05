import { Component, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Role } from '../../../../core/models/role';
import { RoleActions } from '../../store';
import { RolesEditComponent } from '../../../shared/components/roles-edit/roles-edit.component';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

  roles: Role[];

  constructor(private readonly store: Store<any>,
              private readonly dialog: MatDialog,
              private readonly router: Router) {
    this.store.select(state => state.rolesList).subscribe(roleList => {
      if (Object.keys(roleList).length > 0) {
        this.roles = roleList;
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(<Action>RoleActions.list());
  }

  manageRole(roleID: string = null) {
    if (roleID) {
      this.store.dispatch(<Action>RoleActions.load(roleID));
    } else {
      this.store.dispatch(<Action>RoleActions.new());
    }
    const dialogRef = this.dialog.open(RolesEditComponent, {
      width: '75%',
    });
    dialogRef.disableClose = true;
  }

  deleteRole(role: Role) {
    const confirmMessage = {
      title: 'USERS.DELETE.TITLE',
      message: 'USERS.DELETE.MESSAGE',
      name: role.name,
      action: <Action>RoleActions.remove(role._id)
    };
    this.store.dispatch(<Action>RoleActions.confirm(confirmMessage));
  }

}

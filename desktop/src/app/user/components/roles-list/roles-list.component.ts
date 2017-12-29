import { Component, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Role } from '../../models/role';
import { RoleActions } from '../../store';
import { RolesEditComponent } from '../roles-edit/roles-edit.component';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

  roles: Role[];
  total: number;

  constructor(private readonly store: Store<any>,
              private readonly dialog: MatDialog,
              private readonly router: Router) {
    this.store.select(state => state.roleList).subscribe(roleList => {
      if (Object.keys(roleList).length > 0) {
        this.roles = roleList.roles;
        this.total = roleList.total;
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

  deleteRole(roleID: string) {
    this.store.dispatch(<Action>RoleActions.remove(roleID));
  }

}
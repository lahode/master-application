import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store, Action } from '@ngrx/store';

import { Role } from '../../models/role';
import { User } from '../../models/user';
import { RoleActions } from '../../store';
import { GLOBAL_PERMISSIONS } from '../../../app.permissions';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss']
})
export class RolesEditComponent implements OnInit, OnDestroy {

  editRoleForm: FormGroup;
  permsOptions: string[];
  currentUser: User;
  roleEdit: Role;
  stateSelect: any;

  constructor(private store: Store<any>,
              private readonly dialogRef: MatDialogRef<RolesEditComponent>,
              private readonly _fb: FormBuilder) {}

  ngOnInit() {
    // Initialize the list of permissions
    this.permsOptions = GLOBAL_PERMISSIONS;

    // Initialize edit role form.
    this.editRoleForm = this._fb.group({
      _id: [''],
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      permissions: this._fb.array(this.initPermissions()),
    });

    // Get connected user and current role edit to fill the form.
    this.stateSelect = this.store.select(state => state)
      .filter((state) => !state.loading)
      .subscribe(state => {
        this.currentUser = state.currentUser;
        this.roleEdit = state.roleEdit;
        // Set role data to role form.
        if (Object.keys(this.roleEdit).length > 0) {
          Object.keys(this.roleEdit).forEach(key => {
            if (this.editRoleForm.controls.hasOwnProperty(key)) {
              if (key === 'permissions') {
                this.editRoleForm.controls['permissions'] = this._fb.array(this.initPermissions(this.roleEdit[key]));
              } else {
                this.editRoleForm.controls[key].setValue(this.roleEdit[key]);
              }
            }
          });
        }
      });
  }

  // Initialize each permissions in the form.
  initPermissions(perms = []) {
    const permsForm = [];
    this.permsOptions.map(r => {
      permsForm.push(perms.includes(r));
    });
    return permsForm;
  }

  // Cancel the changes.
  cancel(): void {
    this.dialogRef.close();
  }

  // Save the role form.
  save(): void {
    const model = this.editRoleForm.value;

    // Convert permissions checkboxes
    const permissions: string[] = [];
    model.permissions.map((selected, i) => {
      if (selected) {
        permissions.push(this.permsOptions[i]);
      }
    });
    model.permissions = permissions;

    // Set form updates to the original role object
    if (this.roleEdit) {
      Object.keys(model).map(key => {
        this.roleEdit[key] = model[key];
      });
    } else {
      this.roleEdit = model;
    }

    // Save the role
    if (this.roleEdit._id) {
      this.store.dispatch(<Action>RoleActions.update(this.roleEdit));
    } else {
      delete(this.roleEdit._id);
      this.roleEdit.owner = this.currentUser._id;
      this.store.dispatch(<Action>RoleActions.create(this.roleEdit));
    }

    // Close the form.
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.stateSelect.unsubscribe();
  }

}

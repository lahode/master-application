import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store, Action } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { Role } from '../../../../core/models/role';
import { User } from '../../../../core/models/user';
import { RoleActions } from '../../../user/store';
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

  constructor(private readonly _store: Store<any>,
              private readonly _dialogRef: MatDialogRef<RolesEditComponent>,
              private readonly _fb: FormBuilder) {}

  ngOnInit() {
    // Initialize the list of roles
    this._store.dispatch(<Action>RoleActions.getPermissions());

    // Initialize edit role form.
    this.editRoleForm = this._fb.group({
      _id: [''],
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      permissions: this._fb.array([]),
    });

    // Get connected user and current role edit to fill the form.
    this.stateSelect = this._store.select(state => state)
      .pipe(
        filter((state) => state.loading.length === 0),
        filter((state) => state.permissionsList)
      )
      .subscribe(state => {
        this.currentUser = state.currentUser;
        this.roleEdit = state.roleEdit;
        this.permsOptions = state.permissionsList;
        // Set role data to role form.
        if (Object.keys(this.roleEdit).length > 0) {
          Object.keys(this.roleEdit).forEach(key => {
            if (this.editRoleForm.controls.hasOwnProperty(key)) {
              if (key === 'permissions') {
                this.initPermissions(this.roleEdit[key]);
              } else {
                this.editRoleForm.controls[key].setValue(this.roleEdit[key]);
              }
            }
          });
        }
        // Set default list of permissions for the checkboxes.
        if (this.editRoleForm.get('permissions').value.length === 0) {
          this.initPermissions();
        }
      });
  }

  // Initialize each permissions in the form.
  initPermissions(perms = []) {
    this.permsOptions.map(p => {
      (this.editRoleForm.get('permissions') as FormArray).push(new FormControl(perms.includes(p)));
    });
  }

  // Cancel the changes.
  cancel(): void {
    this._dialogRef.close();
  }

  // Save the role form.
  save(): void {
    const model = this.editRoleForm.value;

    // Convert permissions checkboxes.
    const permissions: string[] = [];
    model.permissions.map((selected, i) => {
      if (selected) {
        permissions.push(this.permsOptions[i]);
      }
    });
    model.permissions = permissions;

    // Set form updates to the original role object.
    if (this.roleEdit) {
      Object.keys(this.roleEdit).map(key => {
        if (!model.hasOwnProperty(key)) {
          model[key] = this.roleEdit[key];
        }
      });
    }
    this.roleEdit = model;

    // Save the role
    if (this.roleEdit._id) {
      this._store.dispatch(<Action>RoleActions.update(this.roleEdit));
    } else {
      delete(this.roleEdit._id);
      this.roleEdit.owner = this.currentUser._id;
      this._store.dispatch(<Action>RoleActions.create(this.roleEdit));
    }

    // Close the form.
    this._dialogRef.close();
  }

  ngOnDestroy() {
    this.stateSelect.unsubscribe();
  }

}

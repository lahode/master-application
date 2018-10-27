import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store, Action } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { Role } from '../../../../core/models/role';
import { User } from '../../../../core/models/user';
import { UserActions } from '../../store';
import { RoleActions } from '../../store';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit, OnDestroy {

  editUserForm: FormGroup;
  rolesOptions: Role[];
  currentUser: User;
  userEdit: User;
  stateSelect: any;

  constructor(private store: Store<any>,
              private readonly dialogRef: MatDialogRef<UsersEditComponent>,
              private readonly _fb: FormBuilder) {}

  ngOnInit() {
    // Define email validation pattern
    const emailpattern = `[a-z0-9!#$%&'*+/=?^_"{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_"{|}~-]+)` +
                         `@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`;

    // Initialize the list of roles
    this.store.dispatch(<Action>RoleActions.list());

    // Initialize edit user form.
    this.editUserForm = this._fb.group({
      _id: [''],
      username: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      email: ['', [<any>Validators.required, Validators.pattern(emailpattern)]],
      roles: this._fb.array([]),
    });

    // Get connected user and current user edit to fill the form.
    this.stateSelect = this.store.select(state => state)
      .pipe(
        filter((state) => state.loading.length === 0),
        filter((state) => state.rolesList)
      )
      .subscribe(state => {
        this.currentUser = state.currentUser;
        this.userEdit = state.userEdit;
        this.rolesOptions = state.rolesList;
        // Set user data to user form or reset users form.
        if (Object.keys(this.userEdit).length > 0) {
          Object.keys(this.userEdit).forEach(key => {
            if (this.editUserForm.controls.hasOwnProperty(key)) {
              if (key === 'roles') {
                this.initRoles(this.userEdit[key]);
              } else {
                this.editUserForm.controls[key].setValue(this.userEdit[key]);
              }
            }
          });
        }
        // Set default list of roles for the checkboxes.
        if (this.editUserForm.get('roles').value.length === 0) {
          this.initRoles();
        }
      });
  }

  // Initialize each roles in the form.
  initRoles(roles = []) {
    this.rolesOptions.map(r => {
      (this.editUserForm.get('roles') as FormArray).push(new FormControl(roles.some(item => item.role === r._id)));
    });
  }

  // Cancel the changes.
  cancel(): void {
    this.dialogRef.close();
  }

  // Save the user form.
  save(): void {
    const model = this.editUserForm.value;

    // Convert roles checkboxes.
    const roles: any[] = [];
    model.roles.map((selected, i) => {
      if (selected) {
        roles.push({ role: this.rolesOptions[i]._id });
      }
    });
    model.roles = roles;

    // Set form updates to the original user object.
    if (this.userEdit) {
      Object.keys(this.userEdit).map(key => {
        if (!model.hasOwnProperty(key)) {
          model[key] = this.userEdit[key];
        }
      });
    }
    this.userEdit = model;

    // Save the user
    if (this.userEdit._id) {
      this.store.dispatch(<Action>UserActions.update(this.userEdit));
    } else {
      delete(this.userEdit._id);
      this.userEdit.owner = this.currentUser._id;
      this.store.dispatch(<Action>UserActions.create(this.userEdit));
    }

    // Close the form.
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.stateSelect.unsubscribe();
  }

}
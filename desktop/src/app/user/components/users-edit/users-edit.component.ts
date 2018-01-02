import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store, Action } from '@ngrx/store';

import { Role } from '../../models/role';
import { User } from '../../models/user';
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
    // Initialize the list of roles
    this.store.dispatch(<Action>RoleActions.list());

    // Initialize edit user form.
    this.editUserForm = this._fb.group({
      _id: [''],
      username: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      email: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      roles: this._fb.array([]),
    });

    // Get connected user and current user edit to fill the form.
    this.stateSelect = this.store.select(state => state)
      .filter((state) => !state.loading)
      .filter((state) => state.roleList.roles)
      .subscribe(state => {
        this.currentUser = state.currentUser;
        this.userEdit = state.userEdit;
        this.rolesOptions = state.roleList.roles;
        // Set role data to user form or reset roles form.
        // if (Object.keys(this.userEdit).length > 0) {
        //   Object.keys(this.userEdit).forEach(key => {
        //     if (this.editUserForm.controls.hasOwnProperty(key)) {
        //       if (key === 'roles') {
        //         this.editUserForm.controls['roles'] = this._fb.array(this.initRoles(this.userEdit[key]));
        //       } else {
        //         this.editUserForm.controls[key].setValue(this.userEdit[key]);
        //       }
        //     }
        //   });
        // } else {
          console.log(this.rolesOptions)
          console.log(this.editUserForm.controls.roles)
          // this.editUserForm.controls['roles'].patchValue(
          //   [true]
          // )

          //this.editUserForm.controls['roles'] = this._fb.array(this.initRoles());
        // }
      });
  }

  // Initialize each roles in the form.
  initRoles(roles = []) {
    const rolesForm = [];
    this.rolesOptions.map(r => {
      rolesForm.push(roles.includes(r._id))
    });
    return rolesForm;
  }

  // Cancel the changes.
  cancel(): void {
    //this.dialogRef.close();
    let roles = this.editUserForm.get('roles') as FormArray;
    roles.push(this._fb.array([this.roleFill()]))
  //   this.editUserForm.patchValue({
  //   username: 'toto titi',
  //   roles: []
  // })
  }

  roleFill() {
    return this._fb.group({
        role: true,
      });
  }

// https://stackoverflow.com/questions/43423333/angular-how-to-get-the-multiple-checkbox-value
  onChange(email:string, isChecked: boolean) {
    const emailFormArray = <FormArray>this.myForm.controls.useremail;

    if(isChecked) {
      emailFormArray.push(new FormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == email)
      emailFormArray.removeAt(index);
    }
  }

  // Save the user form.
  save(): void {
    const model = this.editUserForm.value;

    // Convert roles checkboxes
    const roles: any[] = [];
    model.roles.map((selected, i) => {
      if (selected) {
        roles.push({ role: this.rolesOptions[i]._id });
      }
    });
    model.roles = roles;

    // Set form updates to the original user object
    if (this.userEdit) {
      Object.keys(model).map(key => {
        this.userEdit[key] = model[key];
      });
    } else {
      this.userEdit = model;
    }

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

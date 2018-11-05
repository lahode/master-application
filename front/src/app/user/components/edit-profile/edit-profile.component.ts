import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public editProfileform: FormGroup;
  public readonly user$: Observable<any>;

  constructor(private readonly _store: Store<any>,
              private readonly _fb: FormBuilder) {
    this.user$ = this._store.select(state => state.currentUser);
  }

  ngOnInit() {
    // Authenticate form
    this.editProfileform = this._fb.group({
      currentPassword: [''],
      username: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
      firstname: [''],
      lastname: [''],
      description: [''],
    });
  }

}

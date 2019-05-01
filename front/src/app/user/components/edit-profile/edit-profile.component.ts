import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ScanComponent } from '../../../shared/components/scan/scan.component';
import { environment } from '../../../../environments/environment';
import { User } from '../../../../core/models/user';
import { DoubleValidation } from '../../../../core/services/custom-validation';
import { UserActions } from '../../../user/store';
import { AppActions } from '../../../../core/store';
import { FileService, ImageDataConverterService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfileComponent implements OnInit {
  private userEdit: User;
  public user$: Observable<any>;
  public editProfileform: FormGroup;
  public enableAuthChange = false;
  public emailNotification = environment.emailNotification;
  private _picture: string;
  private _pictureToUpload: Subject<any> = new Subject<any>();
  public picture$: Observable<any> = this._pictureToUpload.asObservable();

  constructor(private readonly _store: Store<any>,
              private readonly _router: Router,
              private readonly _dialog: MatDialog,
              private readonly _fb: FormBuilder,
              private readonly _file: FileService,
              private readonly _imgDataConvert: ImageDataConverterService,
              public translate: TranslateService) { }

  ngOnInit() {
    // Initialize edit profile form.
    this.editProfileform = this._fb.group({
      _id: [''],
      username: ['', [<any>Validators.minLength(4), <any>Validators.pattern('^[a-zA-Z0-9-]+$')]],
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      language: [this.translate.currentLang],
      emailNotify: [''],
      description: [''],
      passwordcurrent: [''],
      passwordnew: [''],
      passwordconfirm: ['']
    }, {
      validator: DoubleValidation.MatchPassword
    });

    // Get connected user and current user edit to fill the form.
    this.user$ = this._store.select(state => state)
      .pipe(
        filter((state) => state.loading.length === 0),
        map(state => {
          // Set user data to user form or reset users form.
          this.userEdit = state.currentUser;

          // Load picture if existing.
          this._picture = state.currentUser ? state.currentUser.picture : null;
          if (this._picture) {
            this._file.view(this._picture).pipe(take(1)).subscribe(p => this._pictureToUpload.next(p));
          }
          // Check if user connection type is by token.
          const tokenCheck = this.userEdit['sub'].split('|');
          if (tokenCheck.length === 2 && tokenCheck[0]) {
            const tokenType = tokenCheck[0].split('-');
            this.enableAuthChange = tokenType.length === 2 && tokenType[0] === 'token' ? true : false;
          }
          // Update the form data with the current user.
          if (Object.keys(this.userEdit).length > 0) {
            Object.keys(this.userEdit).forEach(key => {
              if (this.editProfileform.controls.hasOwnProperty(key)) {
                this.editProfileform.controls[key].setValue(this.userEdit[key]);
              }
            });
          }
          return this.userEdit;
        })
      );
  }

  // Cancel the changes and return to user page.
  cancel(): void {
    this._router.navigate([environment.homepage]);
  }

  // Save the user form.
  save(): void {
    const model = this.editProfileform.value;

    // Remove e-mail notification options if disabled.
    if (!this.emailNotification) {
      delete(model.emailNotify);
    }

    // Set form updates to the original user object.
    if (this.userEdit) {
      Object.keys(this.userEdit).map(key => {
        if (!model.hasOwnProperty(key)) {
          model[key] = this.userEdit[key];
        }
      });
    }
    // Remove password confirm field.
    delete(model.passwordconfirm);

    // Update the picture if it has been changed.
    model.picture = this._picture || null;

    this.userEdit = model;

    // Update the user in the back-end.
    this._store.dispatch(<Action>UserActions.updateProfile(this.userEdit));
  }

  // Scan the image.
  public scanImage(event: Event) {
    event.preventDefault();
    const dialogRef = this._dialog.open(ScanComponent, {
      width: '75%',
      data: {
        title: 'Capturez votre image de profil',
        options: {
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 640 },
          }
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.success) {
          // Tranform image to blob.
          const blob = this._imgDataConvert.dataURItoBlob(result.data);
          if (blob) {

            // Set temporary filename and add blob to formData.
            const fileName = `profile.${blob.type.split('/')[1]}`;
            const formData = new FormData(document.forms[0]);
            formData.append('file', blob, fileName);

            // Upload the file to the server and add it to the existing attachments.
            this._file.upload(formData, 'profiles').subscribe((resultFile: any) => {
              if (resultFile['success']) {
                this._picture = resultFile.file;
                this._pictureToUpload.next(result.data);
              }
            }, err => {
              this._store.dispatch(<Action>AppActions.setError(err));
            });
          }
        } else {
          this._store.dispatch(<Action>AppActions.setError(result.data));
        }
      }
    });
  }

  // Upload a file.
  public uploadFile(event: Event) {
    if (event.target['files'] && event.target['files'].length > 0) {

      // Append file to formData.
      const file = event.target['files'][0];
      const formData: any = new FormData();
      formData.append('file', file);

      // Upload the file to the server and add it to the existing attachments.
      this._file.upload(formData, 'profiles').subscribe(result => {
        if (result['success']) {
          this._picture = result.file;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this._pictureToUpload.next(reader.result);
          };
        }
      }, err => {
        this._store.dispatch(<Action>AppActions.setError(err));
      });
    }
  }

  // Remove the picture.
  public deletePicture() {
    this._picture = null;
    this._pictureToUpload.next(null);
  }

}

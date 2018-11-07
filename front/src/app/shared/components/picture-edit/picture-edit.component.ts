import { Component, ViewChild } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';

import { FileService } from '../../../../core/services/file.service';
import { AppActions } from '../../../../core/store';

@Component({
  selector: 'app-picture-edit',
  templateUrl: './picture-edit.component.html',
  styleUrls: ['./picture-edit.component.scss']
})
export class PictureEditComponent {

  @ViewChild('fileInput') fileInput;

  constructor(private readonly _dialogRef: MatDialogRef<PictureEditComponent>,
              private readonly _store: Store<any>,
              private readonly _file: FileService) { }

  uploadFile() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData: any = new FormData();
      formData.append('file', fileBrowser.files[0]);
      this._file.upload(formData).subscribe(result => {
        if (result['success']) {
          this._dialogRef.close(result['file']);
        }
      }, err => {
        this._store.dispatch(<Action>AppActions.setError(err));
        this._dialogRef.close();
      });
    }
  }

}

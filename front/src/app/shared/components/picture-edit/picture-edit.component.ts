import { Component, ViewChild } from '@angular/core';

import { FileService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-picture-edit',
  templateUrl: './picture-edit.component.html',
  styleUrls: ['./picture-edit.component.scss']
})
export class PictureEditComponent {

  @ViewChild('fileInput') fileInput;

  constructor(private readonly file: FileService) { }

  uploadFile() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData: any = new FormData();
      formData.append('file', fileBrowser.files[0]);
      this.file.upload(formData).subscribe(file => {
          console.log(file);
      }, err => console.error(err));
    }
  }



}

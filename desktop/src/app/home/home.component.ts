import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { FileService } from '../../core/services/file.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('fileInput') fileInput;

  public readonly user: Observable<any>;

  constructor(private readonly store: Store<any>,
              private readonly file: FileService) {
    this.user = this.store.select(state => state.currentUser);
  }

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

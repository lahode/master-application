import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetkeyPipe } from './getkey.pipe';
import { OrderByPipe } from './orderby.pipe';
import { ObjtoarrayPipe } from './objtoarray.pipe';
import { Nl2brPipe } from './nl2br.pipe';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
// import { FileUploaderService } from './file-uploader/file-uploader.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    GetkeyPipe,
    OrderByPipe,
    ObjtoarrayPipe,
    Nl2brPipe,
    FileUploaderComponent
  ],
  declarations: [
    GetkeyPipe,
    OrderByPipe,
    ObjtoarrayPipe,
    Nl2brPipe,
    FileUploaderComponent
  ],
  providers: [
    // FileUploaderService,
  ],
})
export class SharedModule {}

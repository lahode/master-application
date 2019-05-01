import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

import {Subject, Observable} from 'rxjs';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanComponent {

  public width = 300;
  public height = 300;
  private _triggerCamera: Subject<void> = new Subject<void>();

  constructor(private readonly _dialogRef: MatDialogRef<ScanComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.options && data.options.width && data.options.height) {
      this.height = Math.round(this.width / data.options.width  * data.options.height);
      console.log(this.height);
    }
  }

  // Trigger the snapshot to trigger subject.
  public triggerSnapshot(): void {
    this._triggerCamera.next();
  }

  // Get the trigger subject as an Observable.
  public get triggerObservable(): Observable<void> {
    return this._triggerCamera.asObservable();
  }

  // Close the dialog and send the error.
  public handleCameraInitError(error: WebcamInitError): void {
    this._dialogRef.close({success: false, data: error});
  }

  // Cancel and close dialog.
  public cancel(): void {
    this._dialogRef.close(false);
  }

  // Return the image captured and close dialog.
  public handleImage(webcamImage: WebcamImage): void {
    this._dialogRef.close({success: true, data: webcamImage.imageAsDataUrl});
  }

}

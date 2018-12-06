import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {

  public title = 'APPLICATION.ERROR.TITLE';

  constructor(
    private readonly _dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data.title) {
        this.title = data.title;
      }
    }

  onNoClick(): void {
    this._dialogRef.close();
  }

}

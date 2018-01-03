import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.scss']
})
export class UserConfirmComponent {

  constructor(public dialogRef: MatDialogRef<UserConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

    cancel(): void {
      this.dialogRef.close(false);
    }
    confirm(): void {
      this.dialogRef.close(true);
    }

}

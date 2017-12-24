import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AppActions } from '../core/store';
import { MessageService } from './message/message.service';
import { User } from './auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public user: User|null;
  private storeErrorSubscription;

  constructor(private store: Store<any>,
              private dialog: MatDialog) {}

  ngOnInit() {
    // Managing error in app
    this.storeErrorSubscription = this.store.select(state => state.error).subscribe(error => {
      if (error) {
        const dialogRef = this.dialog.open(AppErrorComponent, {
          width: '250px',
          data: {error: error.toString()}
        });
        dialogRef.afterClosed().subscribe(result => this.store.dispatch(<Action>AppActions.resetError()));
      }
    });
  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    this.storeErrorSubscription.unsubscribe();
  }

}

@Component({
  selector: 'app-error',
  templateUrl: './app-error.component.html',
})
export class AppErrorComponent {

  constructor(
    public dialogRef: MatDialogRef<AppErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

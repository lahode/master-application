import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';

import { AppActions } from '../core/store';
import { ErrorComponent } from './shared/error/error.component';
import { ConfirmComponent } from './shared/confirm/confirm.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private storeErrorSubscription;
  private storeConfirmSubscription;

  constructor(private store: Store<any>,
              private dialog: MatDialog) {}

  ngOnInit() {
    // Managing error in app
    this.storeErrorSubscription = this.store.select(state => state.error).subscribe(error => {
      if (error) {
        const dialogRef = this.dialog.open(ErrorComponent, {
          width: '50%',
          data: {error: error.toString()}
        });
        dialogRef.afterClosed().subscribe(result => this.store.dispatch(<Action>AppActions.resetError()));
      }
    });

    // Managing confirm dialog in app
    this.storeConfirmSubscription = this.store.select(state => state.confirm).subscribe(confirm => {
      if (confirm && Object.keys(confirm).length > 0) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
          width: '50%',
          data: {title: confirm.title || '', message: confirm.message || '', name: confirm.name || '', delete: false}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.store.dispatch(confirm.action);
            this.store.dispatch(<Action>AppActions.lauchConfirm());
          } else {
            this.store.dispatch(<Action>AppActions.resetConfirm());
          }
        });
      }
    });
  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    this.storeErrorSubscription.unsubscribe();
    this.storeConfirmSubscription.unsubscribe();
  }

}

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';

import { AppActions } from '../core/store';
import { MessageComponent } from './global/components/message/message.component';
import { ConfirmComponent } from './global/components/confirm/confirm.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private storeMessageSubscription;
  private storeConfirmSubscription;
  private storeLoadingSubscription;
  private progressBar: NgProgressRef;

  constructor(private readonly _store: Store<any>,
              private readonly _dialog: MatDialog,
              private readonly _progress: NgProgress) {
    // Get an instance of NgProgressRef.
    this.progressBar = _progress.ref();
  }

  ngOnInit() {
    // Managing messages in app
    this.storeMessageSubscription = this._store.select(state => state.message).subscribe(result => {
      if (result) {
        const message = result.data.message ? result.data.message : result.data.toString();
        const title = result.data.title ? result.data.title : '';
        const dialogRef = this._dialog.open(MessageComponent, {
          width: '50%',
          data: {title: title, message: message}
        });
        dialogRef.afterClosed().subscribe(() => this._store.dispatch(<Action>AppActions.resetError()));
      }
    });

    // Managing confirm dialog in app
    this.storeConfirmSubscription = this._store.select(state => state.confirm).subscribe(confirm => {
      if (confirm && Object.keys(confirm).length > 0) {
        const dialogRef = this._dialog.open(ConfirmComponent, {
          width: '50%',
          data: {title: confirm.title || '', message: confirm.message || '', name: confirm.name || '', delete: false}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this._store.dispatch(confirm.action);
            this._store.dispatch(<Action>AppActions.launchConfirm());
          } else {
            this._store.dispatch(<Action>AppActions.resetConfirm());
          }
        });
      }
    });

    // Managing confirm dialog in app
    this.storeLoadingSubscription = this._store.select(state => state.loading)
      .subscribe(loading => {
        if (loading.length > 0) {
          this.progressBar.start();
        } else {
          this.progressBar.destroy();
        }
      });

  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    this.storeMessageSubscription.unsubscribe();
    this.storeConfirmSubscription.unsubscribe();
    this.storeLoadingSubscription.unsubscribe();
    this._store.dispatch(<Action>AppActions.disconnectSocket());
  }

}

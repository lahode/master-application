import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { SocketService } from '../core/services/socket.service';

import { AppActions } from '../core/store';
import { MessageComponent } from './global/components/message/message.component';
import { ConfirmComponent } from './global/components/confirm/confirm.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private storeMessageSubscription;
  private storeConfirmSubscription;
  private storeLoadingSubscription;
  private storeUpdateSubscription;
  private progressBar: NgProgressRef;

  constructor(private readonly _store: Store<any>,
              private readonly _dialog: MatDialog,
              private readonly _progress: NgProgress,
              private readonly _socket: SocketService) {}

  ngOnInit() {
    // Get an instance of NgProgressRef.
    this.progressBar = this._progress.ref();

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

      // Launch socket client connection.
      this.initIoConnection(true);
  }

  // Socket client.
  private initIoConnection(open: boolean): void {
    if (environment.socket) {
      if (open) {
        this._socket.connect();
        this.storeUpdateSubscription = this._socket.listen('refresh')
          .subscribe((data) => {
            this._store.dispatch(<Action>AppActions.refresh({type: data.type , id: data.id}));
          });
      } else {
        this.storeUpdateSubscription.unsubscribe();
      }
    }
  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    this.storeConfirmSubscription.unsubscribe();
    this.storeLoadingSubscription.unsubscribe();
    this.storeMessageSubscription.unsubscribe();
    this.initIoConnection(false);
    this._store.dispatch(<Action>AppActions.disconnectSocket());
  }

}

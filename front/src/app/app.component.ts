import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';

import { Subscription } from 'rxjs';

import { AppActions } from '../core/store';
import { environment } from '../environments/environment';
import { MessageComponent } from './global/components/message/message.component';
import { ConfirmComponent } from './global/components/confirm/confirm.component';
import { SocketService } from '../core/services/socket.service';
import { MediaQueryService } from '../core/services/media-query.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  private _storeMessageSubscription: Subscription;
  private _storeConfirmSubscription: Subscription;
  private _storeUpdateSubscription: Subscription;
  private _isMobileSubscribe: Subscription;
  private _isMobile: boolean;

  constructor(private readonly _store: Store<any>,
              private readonly _dialog: MatDialog,
              private readonly _socket: SocketService,
              private readonly _mediaQueryService: MediaQueryService) {}

  ngOnInit() {
    // Manage mobile service.
    this._isMobileSubscribe = this._mediaQueryService.isMobile$.subscribe((mobile) => {
      if (mobile) {
        this._isMobile = true;
      } else {
        this._isMobile = false;
      }
    });

    // Managing messages in app
    this._storeMessageSubscription = this._store.select(state => state.message).subscribe(result => {
      if (result) {
        const message = result.data.message ? result.data.message : result.data.toString();
        const title = result.data.title ? result.data.title : '';
        const dialogRef = this._dialog.open(MessageComponent, {
          width: this._isMobile ? '80%' : '50%',
          data: {title: title, message: message}
        });
        dialogRef.afterClosed().subscribe(() => this._store.dispatch(<Action>AppActions.resetError()));
      }
    });

    // Managing confirm dialog in app
    this._storeConfirmSubscription = this._store.select(state => state.confirm).subscribe(confirm => {
      if (confirm && Object.keys(confirm).length > 0) {
        const dialogRef = this._dialog.open(ConfirmComponent, {
          width: this._isMobile ? '80%' : '50%',
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

    // Launch socket client connection.
    this._initIoConnection(true);
  }

  // Socket client.
  private _initIoConnection(open: boolean): void {
    if (environment.socket) {
      if (open) {
        this._socket.connect();
        this._storeUpdateSubscription = this._socket.listen('refresh').subscribe((data) => {
          this._store.dispatch(<Action>AppActions.refresh({type: data.type , id: data.id}));
        });
      } else {
        this._storeUpdateSubscription.unsubscribe();
      }
    }
  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    this._storeMessageSubscription.unsubscribe();
    this._storeConfirmSubscription.unsubscribe();
    this._isMobileSubscribe.unsubscribe();
    this._initIoConnection(false);
  }

}

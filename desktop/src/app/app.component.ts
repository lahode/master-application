import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

import { AppActions } from '../core/store';
import { ErrorComponent } from './global/components/error/error.component';
import { ConfirmComponent } from './global/components/confirm/confirm.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private storeErrorSubscription;
  private storeConfirmSubscription;
  private storeLoadingSubscription;
  private progressBar = true;

  constructor(private store: Store<any>,
              private dialog: MatDialog,
              private progressService: NgProgress) {}

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
            this.store.dispatch(<Action>AppActions.launchConfirm());
          } else {
            this.store.dispatch(<Action>AppActions.resetConfirm());
          }
        });
      }
    });

    // Managing confirm dialog in app
    this.storeLoadingSubscription = this.store.select(state => state.loading)
      .subscribe(loading => {
        if (loading.length > 0) {
          this.progressService.start();
        } else {
          this.progressService.done();
        }
      });

  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    this.storeErrorSubscription.unsubscribe();
    this.storeConfirmSubscription.unsubscribe();
    this.storeLoadingSubscription.unsubscribe();
    this.store.dispatch(<Action>AppActions.disconnectSocket());
  }

}

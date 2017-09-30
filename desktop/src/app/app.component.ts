import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { AppStateI, AuthActions } from '../core';
import { MessageService } from './message/message.service';
import { User } from './auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public user: User|null;
  private storeErrorSubscription$;
  private storeUserSubscription$;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<any>,
              private authActions: AuthActions,
              private dialog: MdDialog) {}

  ngOnInit() {
    // Managing error in app
    this.storeErrorSubscription$ = this.store.select(state => state.error)
    this.storeErrorSubscription$.subscribe(error => {
      console.log(error)
      if (error) {
        const dialogRef = this.dialog.open(AppErrorComponent, {
          width: '250px',
          data: {error: error.toString()}
        });
        dialogRef.afterClosed().subscribe(result => this.store.dispatch(<Action>this.authActions.resetError()));
      }
    });

    // Managing user auth statut
    this.store.dispatch(this.authActions.checkAuth());
    this.storeUserSubscription$ = this.store.select(state => state.currentUser)
    this.storeUserSubscription$.subscribe(user => {
      console.log(user)
      if (user) {
        // Redirect to returnUrl page if user exist
        this.user = user;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      } else {
        // Redirect to login page if user is logged out
        if (this.user) {
          this.user = null;
          this.router.navigate(['/signin']);
        }
      }
    });
  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    // this.storeErrorSubscription$.unsubscribe();
    // this.storeUserSubscription$.unsubscribe();
  }

}

@Component({
  selector: 'app-error',
  templateUrl: './app-error.component.html',
})
export class AppErrorComponent {

  constructor(
    public dialogRef: MdDialogRef<AppErrorComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

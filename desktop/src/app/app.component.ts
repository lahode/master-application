import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

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
  private storeErrorSubscription;
  private storeUserSubscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<any>,
              private authActions: AuthActions,
              private messageService: MessageService) {}

  ngOnInit() {
    // Managing error in app
    this.storeErrorSubscription = this.store.select(state => state.error).subscribe(error => {
      if (error) {
        this.messageService.error(error.toString());
      }
    });

    // Managing user auth statut
    this.store.dispatch(this.authActions.checkAuth());
    this.storeUserSubscription = this.store.select(state => state.currentUser).subscribe(user => {
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
    this.storeErrorSubscription.unsubscribe();
    this.storeUserSubscription.unsubscribe();
  }

}

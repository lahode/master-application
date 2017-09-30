import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Store, Action } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { AuthActions, AppStateI } from "../core";

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  rootPage:any;
  public user: any|null;
  public storeUserSubscription$;
  public storeErrorSubscription$;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private store: Store<any>,
    private authActions: AuthActions
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Managing error in app
      this.storeErrorSubscription$ = this.store.select(state => state.error);
      this.storeErrorSubscription$.subscribe(error => {
        if (error) {
          this.displayError(error.toString());
        }
      });

      // Managing user auth statut
      this.storeUserSubscription$ = this.store.select(state => state.currentUser);
      this.storeUserSubscription$.subscribe(user => {
        if (user) {
          // If logged in go to Home page
          this.user = user;
          this.rootPage = 'HomePage';
        } else {
          // Redirect to login page if user is logged out
          if (this.user) {
            this.user = null;
            this.rootPage = 'LoginPage';
          }
        }
      });
    });
  }

  ngOnInit() {
    this.rootPage = 'LoginPage';
    this.store.dispatch(this.authActions.checkAuth());
  }

  logout() {
    this.store.dispatch(<Action>this.authActions.logout());
  }

  displayError(error):void {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error.toString(),
      buttons: ['Dismiss']
    });
    alert.present();
  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
/*
    this.storeErrorSubscription$.unsubscribe();
    this.storeUserSubscription$.unsubscribe();
*/
  }

}

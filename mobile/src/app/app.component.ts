/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   26-05-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 10-08-2017
 */

import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { AuthActions, AppStateI } from "../core";

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{

  rootPage:any;
  public storeInfo:Observable<AppStateI>;
  public storeError:Observable<AppStateI>;

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

      this.storeError = this.store.select(state => state.error)
      this.storeError.subscribe(error => {
        if(error){
          this.displayError(error)
        }
      })

      this.storeInfo = this.store.select((state:AppStateI) => state.currentUser)
      this.storeInfo.subscribe(currentUser => {

        if (currentUser) {
          // If logged in go to Home page
          this.rootPage = HomePage;
        }
        else {
          // If not logged in go to Login page
          this.rootPage = 'LoginPage';
        }
      });
    });
  }

  ngOnInit() {
    this.rootPage = 'LoginPage';
    this.store.dispatch(this.authActions.checkAuth());
  }

  displayError(error):void {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error.toString(),
      buttons: ['Dismiss']
    });
    alert.present();
  }
}

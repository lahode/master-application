/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   26-05-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 30-05-2017
*/

import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Store, Action } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { AppStateI, AuthActions } from "../../core";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public user:any;
  public storeInfo:Observable<AppStateI>;

  constructor(
    public navCtrl: NavController,
    private store: Store<any>,
    private authActions: AuthActions,
) {
    // use the object in the template since it is an observable
    this.storeInfo = this.store.select(state => state)
  }

  ngOnInit():void {
  }

  navToEdit(todo:any):void {
    // console.log('navToEdit-> ', todo)
    this.navCtrl.push('ItemEditPage', {
      id: todo._id,
      todo: todo
    })
  }

  doLogout(){
    this.store.dispatch(<Action>this.authActions.logout());
  }

  clearInput(todoInput:any):void{
    todoInput.value = '';
  }
}

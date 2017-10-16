import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Store, Action } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { AppStateI, AuthActions } from '../../core';

@IonicPage({
  name:'HomePage',
  segment:'index'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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

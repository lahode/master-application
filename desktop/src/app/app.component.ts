import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { AppStateI, AuthActions } from '../core';
import { MessageService } from './message/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public storeError: Observable<AppStateI>;

  constructor(private store: Store<any>,
              private authActions: AuthActions,
              private messageService: MessageService) {}

  ngOnInit() {
    this.storeError = this.store.select(state => state.auth.error)
    this.storeError.subscribe(error => {
      if (error) {
        this.messageService.error(error.toString());
      }
    });
    this.store.dispatch(this.authActions.checkAuth());
  }

  ngOnDestroy() {
    // this.storeError.unsubscribe();
  }

}

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppActions } from '../../core/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public readonly user$: Observable<any>;

  constructor(private readonly _store: Store<any>) {
    this.user$ = this._store.select(state => state.currentUser);
  }

  ngOnInit() {
    // Add a sidenav menu link.
    this._store.dispatch(<Action>AppActions.setMenu([
      { label: 'Home', path: `/home`, icon: 'info' }
    ]));
  }

  ngOnDestroy() {
    // Empty sidenav menu links.
    this._store.dispatch(<Action>AppActions.resetMenu());
  }

}

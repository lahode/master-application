import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public readonly user$: Observable<any>;

  constructor(private readonly _store: Store<any>) {
    this.user$ = this._store.select(state => state.currentUser);
  }

}

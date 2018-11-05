import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent {

  public readonly user$: Observable<any>;

  constructor(private readonly _store: Store<any>) {
    this.user$ = this._store.select(state => state.currentUser);
  }

}

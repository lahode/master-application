import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FileService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  public user$: Observable<any>;
  public picture$: Observable<any>;

  constructor(private readonly _store: Store<any>,
              private readonly _file: FileService) {}

  ngOnInit() {
    // Get the current user.
    this.user$ = this._store.select(state => state.currentUser)
      .pipe(
        map(user => {
          // Get the current user picture.
          if (user && user.picture) {
            this.picture$ = this._file.view(user.picture);
          }
          return user;
        })
      );
  }

}

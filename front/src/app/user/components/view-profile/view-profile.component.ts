import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FileService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent {

  public readonly user$: Observable<any>;
  public picture$: Observable<any>;

  constructor(private readonly _store: Store<any>,
              private readonly _file: FileService) {
    this.user$ = this._store.select(state => state.currentUser)
      .pipe(
        map(user => {
          if (user.picture) {
            this.picture$ = this._file.view(user.picture);
          }
          return user;
        })
      );
  }

}

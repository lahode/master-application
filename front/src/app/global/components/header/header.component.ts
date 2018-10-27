import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Router} from '@angular/router';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../../../auth/store';
import { AppActions } from '../../../../core/store';

const DEFAULT_LANGUAGE = 'en';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user$: Observable<boolean>;
  public language$: Observable<any>;

  constructor(private translate: TranslateService,
              private readonly _store: Store<any>,
              private readonly _router: Router) {
    translate.addLangs(['en', 'fr']);
  }

  ngOnInit() {
    this._store.dispatch(<Action>AuthActions.checkAuth());
    this.user$ = this._store.select(state => state.currentUser)
      .pipe(
        map(user => {
          this.setDefaultLang('');
          return user !== null;
        })
      );
    this.language$ = this._store.select(state => state.language)
      .pipe(
        filter(language => language !== ''),
        map(language => this.translate.use(language))
      );
  }

  setDefaultLang(userlang) {
    const browserLang = this.translate.getBrowserLang();
    let currentLang = DEFAULT_LANGUAGE;
    if (userlang.match(/en|fr/)) {
      currentLang = userlang;
    } else if (browserLang.match(/en|fr/)) {
      currentLang = browserLang;
    }
    this._store.dispatch(<Action>AppActions.setLanguage(currentLang));
  }

  logout() {
    this._store.dispatch(<Action>AuthActions.logout());
  }

  setLanguage(value) {
    this._store.dispatch(<Action>AppActions.setLanguage(value));
  }

}

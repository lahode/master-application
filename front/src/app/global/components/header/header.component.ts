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

  constructor(public translate: TranslateService,
              private readonly _store: Store<any>,
              private readonly _router: Router) {
    translate.addLangs(['en', 'fr']);
  }

  ngOnInit() {
    // Dispatch authentication check.
    this._store.dispatch(<Action>AuthActions.checkAuth());

    // Find the current user.
    this.user$ = this._store.select(state => state.currentUser)
      .pipe(
        map(user => {
          this.setDefaultLang('');
          return user !== null;
        })
      );

    // Find the current language.
    this.language$ = this._store.select(state => state.language)
      .pipe(
        filter(language => language !== ''),
        map(language => this.translate.use(language))
      );
  }

  // Set the language by default.
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

  // Log out the user.
  logout() {
    this._store.dispatch(<Action>AuthActions.logout());
  }

  // Change application language.
  setLanguage(value) {
    this._store.dispatch(<Action>AppActions.setLanguage(value));
  }

}

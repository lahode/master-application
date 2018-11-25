import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../../../auth/store';
import { RoleService } from '../../../user/services/role.service';
import { AppActions } from '../../../../core/store';
import { MenuLink } from '../../../../core/models/menu-link';

const DEFAULT_LANGUAGE = 'en';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user$: Observable<boolean>;
  public language$: Observable<any>;
  public menuLinks: MenuLink[];

  constructor(public translate: TranslateService,
              private readonly _store: Store<any>,
              private readonly _role: RoleService) {
    translate.addLangs(['en', 'fr']);
  }

  ngOnInit() {
    // Dispatch authentication check.
    this._store.dispatch(<Action>AuthActions.checkAuth());

    // Find the current user.
    this.user$ = this._store.select(state => state)
      .pipe(
        map(state => {
          const user = state.currentUser;
          const language = state.language;
          if (!language) {
            this.setDefaultLang(user ? user.language : null);
          }

          // Init menu links
          this.menuLinks = this.initMenu().filter(m => {
            if (m.permissions) {
              return this._role.checkUsersPermission(user, m.permissions);
            }
            return true;
          });
          return user;
        })
      );

    // Find the current language.
    this.language$ = this._store.select(state => state.language)
      .pipe(
        filter(language => language !== ''),
        map(language => {
          this.translate.use(language);
          return language;
        })
      );
  }

  initMenu(): MenuLink[] {
    return [
      {path: '/', label: 'HEADER.MENU.HOME', active: true},
      {path: '/user/manage', label: 'HEADER.MENU.MANAGEUSERS', permissions: ['manage users']},
      {path: '', label: 'HEADER.MENU.LOGOUT', click: 'logout'},
    ];
  }

  // Set the language by default.
  setDefaultLang(userlang) {
    const browserLang = this.translate.getBrowserLang();
    let currentLang = DEFAULT_LANGUAGE;
    if (userlang && userlang.match(/en|fr/)) {
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

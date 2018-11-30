import { Component, OnInit, NgZone, AfterViewInit, ViewContainerRef, ViewChild  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, delay, filter } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../../../auth/store';
import { RoleService } from '../../../user/services/role.service';
import { AppActions } from '../../../../core/store';

import { ViewProfileComponent } from '../../../shared/components/view-profile/view-profile.component';
import { SidenavLink } from '../sidenav-list/sidenav-list.component';
import { MenuLink } from '../../../../core/models/menu-link';

const DEFAULT_LANGUAGE = 'en';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  private widthScreen: number;
  public menuLinks$: Observable<SidenavLink[]>;
  public mode = 'side';
  public open = 'true';
  public user$: Observable<boolean>;
  public language$: Observable<any>;
  public adminLinks: MenuLink[];
  private start: ViewContainerRef;

  @ViewChild('start') set sideNavSetter(theElementRef: ViewContainerRef) {
    this.start = theElementRef;
  }

  constructor(private readonly _store: Store<any>,
              private readonly _router: Router,
              private readonly _ngZone: NgZone,
              public translate: TranslateService,
              private readonly _role: RoleService,
              private readonly _dialog: MatDialog) {
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
          this.adminLinks = this.initMenu().filter(m => {
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

  ngAfterViewInit() {
    // Initialize menu Links from store,
    this.menuLinks$ = this._store.select(state => state.menuLinks).pipe(
      map(menuLinks => {
        const links: SidenavLink[] = [];
        menuLinks.map((menuLink: MenuLink) => {
          links.push(new SidenavLink(menuLink.label, menuLink.path, menuLink.icon));
        });
        return links.length > 0 ? links : null;
      }),
      delay(0)
    );
    this.changeMode();

    // Detection on window resize.
    window.onresize = () => {
      this._ngZone.run(() => {
        this.changeMode();
      });
    };
  }

  // Navigate to course detail with folder
  public moveTo(path: string = null) {
    this._router.navigate([path]);
  }

  // Change responsive mode.
  private changeMode() {
    this.widthScreen = window.innerWidth;
    if (this.widthScreen <= 800) {
        this.mode = 'over';
        this.open = 'false';
    }
    if (this.widthScreen > 800) {
        this.mode = 'side';
        this.open = 'true';
    }
  }

  // Initialize administration menu.
  initMenu(): MenuLink[] {
    return [
      { path: '/', label: 'HEADER.MENU.HOME', active: true },
      { path: '/user/manage', label: 'HEADER.MENU.MANAGEUSERS', permissions: ['manage users'] },
      { path: '', label: 'HEADER.MENU.LOGOUT', click: 'logout' }
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

  // View the user's profile in a modal.
  viewProfile() {
    this._dialog.open(ViewProfileComponent, {
      width: '75%',
      data: null,
    });
  }

}

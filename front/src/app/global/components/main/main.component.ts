import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, NgZone, AfterViewInit, ViewContainerRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, delay, filter } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { User } from '../../../../core/models/user';

import { AuthActions } from '../../../auth/store';
import { RoleService } from '../../../user/services/role.service';
import { AppActions } from '../../../../core/store';

import { LoaderService } from '../../../../core/services/loader.service';
import { FileService } from '../../../../core/services/file.service';

import { ViewProfileComponent } from '../../../shared/components/view-profile/view-profile.component';
import { SidenavLink } from '../sidenav-list/sidenav-list.component';
import { MenuLink } from '../../../../core/models/menu-link';

const DEFAULT_LANGUAGE = 'en';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  private start: ViewContainerRef;
  private widthScreen: number;
  private navState = new BehaviorSubject<any>({
    mode: 'side',
    open: 'true'
  });
  public menuLinks$: Observable<SidenavLink[]>;
  public navState$: Observable<any>;
  public user$: Observable<User>;
  public language$: Observable<any>;
  public adminLinks: MenuLink[];
  private _storeLoadingSubscription: Subscription;
  private _loadGlobalSettings = false;

  @ViewChild('start') set sideNavSetter(theElementRef: ViewContainerRef) {
    this.start = theElementRef;
  }

  constructor(private readonly _store: Store<any>,
              private readonly _router: Router,
              private readonly _ngZone: NgZone,
              private readonly _role: RoleService,
              private readonly _dialog: MatDialog,
              private readonly _loader: LoaderService,
              private readonly _file: FileService,
              public translate: TranslateService) {
    this.navState$ = this.navState.asObservable();
    translate.addLangs(['en', 'fr']);
  }

  ngOnInit() {
    // Dispatch authentication check.
    this._store.dispatch(<Action>AuthActions.checkAuth());

    // Find the current user.
    this.user$ = this._store.select(state => state.currentUser)
      .pipe(
        map(user => {
          // Init menu links
          this.adminLinks = this.initMenu().filter(m => {
            if (m.permissions) {
              return this._role.checkUsersPermission(user, m.permissions);
            }
            return true;
          });

          if (user && !this._loadGlobalSettings) {

            // Clean existing temporary files.
            this._file.fileClean();

            this._loadGlobalSettings = true;
          }
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
        if (menuLinks) {
          menuLinks.map((menuLink: MenuLink) => {
            links.push(new SidenavLink(menuLink.label, menuLink.path, menuLink.icon));
          });
        }
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

    // Managing confirm dialog in app
    this._storeLoadingSubscription = this._store.select(state => state.loading)
      .subscribe(loading => {
        if (loading.length > 0) {
          this._loader.show();
        } else {
          this._loader.hide();
        }
      });
  }

  // Navigate to main application page
  public moveTo(path: string, nav: any) {
    if (nav.mode === 'over') {
      (this.start as any).toggle();
    }
    this._router.navigate([path]);
  }

  // Change responsive mode.
  private changeMode() {
    this.widthScreen = window.innerWidth;
    if (this.widthScreen <= 800) {
      this.navState.next({
        mode: 'over',
        open: 'false'
      });
    }
    if (this.widthScreen > 800) {
      this.navState.next({
        mode: 'side',
        open: 'true'
      });
    }
  }

  // Initialize administration menu.
  initMenu(): MenuLink[] {
    return [
      { path: '/user/manage', label: 'HEADER.MENU.MANAGEUSERS', permissions: ['manage users'] },
      { path: '', label: 'HEADER.MENU.LOGOUT', click: 'logout' }
    ];
  }

  // Set the language by default.
  setDefaultLang(userlang: string) {
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
  setLanguage(value: string) {
    this._store.dispatch(<Action>AppActions.setLanguage(value));
  }

  // View the user's profile in a modal.
  viewProfile() {
    this._dialog.open(ViewProfileComponent, {
      width: '75%',
      data: null,
    });
  }

  // Destroy store subscriptions when leaving component
  ngOnDestroy() {
    this._storeLoadingSubscription.unsubscribe();
  }
}

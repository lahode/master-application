import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { StorageService } from './storage.service';

@Injectable()
export class NavigationService {

  constructor(private readonly _storage: StorageService,
              private readonly _router: Router) {}

  // Set previous Navigation.
  public setPreviousNavigation(routerState: any) {
    this._storage.get('currentNavigation').then(currentNavigation => {
      if (currentNavigation && currentNavigation.url !== routerState.url) {
        this._storage.set('previousNavigation', currentNavigation);
      }
    });
    this._storage.set('currentNavigation', routerState);
    return of(null);
  }

  // Go to navigation.
  public goTo(navigation = null, options = null) {

    // By default use navigation params.
    if (navigation) {
      if (options) {
        this._router.navigate(navigation, options);
      } else {
        this._router.navigate(navigation);
      }
      return;
    }

    // If navigation is null, navigate to previous page.
    this._storage.get('previousNavigation').then(previousNavigation => {
      if (previousNavigation.url) {
        const url = previousNavigation.url.split('?')[0];
        if (previousNavigation.queryParams) {
         this._router.navigate([url], { queryParams: previousNavigation.queryParams });
        } else {
          this._router.navigate([url]);
        }
      }
    });
  }

}

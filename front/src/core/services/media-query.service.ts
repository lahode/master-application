import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';

@Injectable()
export class MediaQueryService {

  public _breakpoint$: ReplaySubject<string> = new ReplaySubject(1);
  public _isMobile$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _mediaObserver: MediaObserver,
  ) {
    this._mediaObserver
      .media$
      .pipe(
        map(({ mqAlias }) => {
          switch (mqAlias) {
            case 'xs':
            case 'sm':
            case 'md':
              return mqAlias;
            default:
              return 'lg';
          }
        }),
        startWith(this._startWith())
      )
      .subscribe((value) => {
        this._breakpoint$.next(value.toString());
        this._isMobile$.next(value === 'xs' || value === 'sm');
      });
  }

  get isMobile$() {
    return this._isMobile$;
  }

  private _startWith() {
    if (window && window.matchMedia) {
      if (window.matchMedia('(max-width: 599px)').matches) {
        return 'xs';
      } else if (window.matchMedia('(max-width: 959px)').matches) {
        return 'sm';
      } else if (window.matchMedia('(max-width: 1279px)').matches) {
        return 'md';
      } else {
        return 'lg';
      }
    } else {
      // likely IE 9
      return false;
    }
  }

}

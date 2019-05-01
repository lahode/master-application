import { Injectable } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Injectable()
export class ScrollPager {

  constructor(private _scrollToService: ScrollToService) { }

  public triggerScrollTo(anchor = '') {
    const config: ScrollToConfigOptions = {
      target: anchor,
    };

    this._scrollToService.scrollTo(config);
  }
}

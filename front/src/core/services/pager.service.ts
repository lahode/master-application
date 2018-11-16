import { Injectable } from '@angular/core';

import { Pager } from '../models/pager';
import { Range } from '../models/range';

const DEFAULT_PAGESIZE = 100;

@Injectable()
export class PagerService {

  // Return the range for the pager.
  public getRange(payload: any, defaultLength = null): Range {
    const previousPageIndex = payload && payload.hasOwnProperty('previousPageIndex') &&
                              !isNaN(payload.previousPageIndex) ? payload.previousPageIndex : 0;
    const pageIndex = payload && payload.hasOwnProperty('pageIndex') &&
                      !isNaN(payload.pageIndex) ? payload.pageIndex : 0;
    const pageSize = payload && payload.hasOwnProperty('pageSize') &&
                    !isNaN(payload.pageSize) ? payload.pageSize : DEFAULT_PAGESIZE;
    let length = 0;
    if (defaultLength) {
      length = defaultLength;
    } else if (payload && payload.hasOwnProperty('length') && !isNaN(payload.length)) {
      length = payload.pageSize;
    }
    return { previousPageIndex, pageIndex, pageSize, length };
  }

  public getFromTo(range: Range) {
    return {from: range.pageIndex * range.pageSize, to: ((range.pageIndex + 1) * range.pageSize)};
  }

  public getDefaultPageSize () {
    return DEFAULT_PAGESIZE;
  }

}

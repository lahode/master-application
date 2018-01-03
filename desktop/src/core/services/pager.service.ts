import { Injectable } from '@angular/core';

import { Pager } from '../models/pager';
import { Range } from '../models/range';

@Injectable()
export class PagerService {

  // Return the range for the pager.
  public getRange(payload: any): Range {
    const pageIndex = this.getPageIndex(payload);
    const pageSize = this.getPageSize(payload);
    return <Range>{from: pageIndex * pageSize, to: ((pageIndex + 1) * pageSize) - 1};
  }

  // Return the page index for the pager.
  public getPageIndex (payload: any): number {
    return payload && payload.hasOwnProperty('pageIndex') && !isNaN(payload.pageIndex) ? payload.pageIndex : 0;
  }

  // Return the page size for the pager.
  public getPageSize (payload: any): number {
    return payload && payload.hasOwnProperty('pageSize') && !isNaN(payload.pageSize) ? payload.pageSize : 10;
  }

}

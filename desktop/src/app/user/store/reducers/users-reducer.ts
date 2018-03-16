import { Action } from '@ngrx/store';
import { UserActions } from '../actions/user.actions';
import { Injector } from '@angular/core';

import { User } from '../../../../core/models/user';
import { Pager } from 'core/models/pager';
import { PagerService } from 'core/services/pager.service';

export interface IUsersState extends Pager {}

export const initialState: IUsersState = null;

const injector = Injector.create([{provide: PagerService, useClass: PagerService, deps: []}]);
const pagerService = injector.get(PagerService);

export function reducer (state: any = initialState, action: any): IUsersState {
  switch (action.type) {
    case UserActions.USERLIST_LOAD_SUCCESS: {
      const newState = Object.assign({}, state);
      return <Pager>{
        items: action.payload.items,
        total: action.payload.total,
        pageIndex: pagerService.getPageIndex(newState),
        pageSize: pagerService.getPageSize(newState)
      };
    }

    case UserActions.USERLIST_CHANGE_PAGE: {
      return Object.assign({}, state, {
        pageIndex: pagerService.getPageIndex(action.payload),
        pageSize: pagerService.getPageSize(action.payload)
      });
    }
  }

  return <IUsersState>state;

}

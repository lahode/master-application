import { Action } from '@ngrx/store';
import { UserActions } from '../actions/user.actions';
import { Injector } from '@angular/core';

import { User } from '../../../../core/models/user';
import { Pager } from '../../../../core/models/pager';
import { PagerService } from '../../../../core/services/pager.service';

export interface IUsersListState extends Pager {}

export const initialState: IUsersListState = null;

const injector = Injector.create([{provide: PagerService, useClass: PagerService, deps: []}]);
const pagerService = injector.get(PagerService);

export function reducer (state: any = initialState, action: any): IUsersListState {
  switch (action.type) {
    case UserActions.USERLIST_LOAD_SUCCESS: {
      const newState = Object.assign({}, state);
      return <Pager>{
        items: (action.payload && action.payload.items) ? action.payload.items : [],
        total: (action.payload && action.payload.total) ? action.payload.total  : 0,
        filter: (newState && newState.filter) ? newState.filter  : null,
        range: (newState && newState.range) ? newState.range : null,
        sort: (newState && newState.sort) ? newState.sort : null,
      };
    }

    case UserActions.USERLIST_CHANGE_PAGE: {
      return Object.assign({}, state, {
        sort: action.payload.sort,
        range: action.payload.range,
        filter: action.payload.filter
      });
    }
  }

  return <IUsersListState>state;

}

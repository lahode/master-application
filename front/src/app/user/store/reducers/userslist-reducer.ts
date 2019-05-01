import { UserActions } from '../actions/user.actions';

import { Pager } from '../../../../core/models/pager';

export interface IUsersListState extends Pager {}

export const initialState: IUsersListState = null;

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

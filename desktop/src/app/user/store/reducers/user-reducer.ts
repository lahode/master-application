import { Action } from '@ngrx/store';
import { UserActions } from '../actions/user.actions';

import { User } from '../../../../core/models/user';

export interface IUserState extends User {}

export const initialState: IUserState = null;

export function reducer (state: IUserState = initialState, action: any): IUserState {
  switch (action.type) {
    case UserActions.USER_NEW: {
      return Object.assign({}, null)
    }

    case UserActions.USER_LOAD_START: {
      return Object.assign({}, state)
    }

    case UserActions.USER_LOAD_SUCCESS: {
      return Object.assign({}, action.payload);
    }

    case UserActions.USER_CREATE_SUCCESS: {
      return Object.assign({}, action.payload);
    }

    case UserActions.USER_UPDATE_SUCCESS: {
      return Object.assign({}, action.payload);
    }

    case UserActions.USER_REMOVE_SUCCESS: {
      return Object.assign({}, null);
    }
  }

  return <IUserState>state;

}

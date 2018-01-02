import { Action } from '@ngrx/store';
import { UserActions } from '../actions/user.actions';

import { User } from '../../models/user';

export interface IUsersState extends Array<User> {}

export const initialState: IUsersState = [];

export function reducer (state: any = initialState, action: any): IUsersState {
  switch (action.type) {
    case UserActions.USERLIST_LOAD_START: {
      return Object.assign([], action.payload)
    }

    case UserActions.USERLIST_LOAD_SUCCESS: {
      return Object.assign([], action.payload)
    }

    case UserActions.USER_CREATE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.users.push(action.payload);
      return newState;
    }

    case UserActions.USER_UPDATE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.users = Object.assign([], state.users.map((item: User) => {
        return item._id === action.payload._id ? action.payload : item;
      }));
      return newState;
    }

    case UserActions.USER_REMOVE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.users = Object.assign([], state.users.filter((item: User) => {
        return item._id !== action.payload.deleted;
      }));
      return newState;
    }

    default: {
      return <IUsersState>state;
    }
  }
}

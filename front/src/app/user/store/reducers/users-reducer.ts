import { UserActions } from '../actions/user.actions';

import { User } from '../../../../core/models/user';

export interface IUsersState extends Array<User> {}

export const initialState: IUsersState = null;

export function reducer (state: any = initialState, action: any): IUsersState {
  switch (action.type) {
    case UserActions.PROFILE_LOAD_SUCCESS:
    case UserActions.USERS_LOAD_SUCCESS: {
      return [...action.payload];
    }

    case UserActions.USER_CREATE_SUCCESS: {
      const newState = [...state];
      newState.push(action.payload);
      return newState;
    }

    case UserActions.USER_UPDATE_SUCCESS: {
      return [...state.map((item: User) => item._id === action.payload._id ? action.payload : item)];
    }

    case UserActions.USER_REMOVE_SUCCESS: {
      return [...state.filter((item: User) => item._id !== action.payload.deleted)];
    }
  }
  return <IUsersState>state;

}

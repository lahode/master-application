import { Action } from '@ngrx/store';
import { RoleActions } from '../actions/role.actions';

import { Role } from '../../../../core/models/role';

export interface IRolesState extends Array<Role> {}

export const initialState: IRolesState = [];

export function reducer (state: any = initialState, action: any): IRolesState {
  switch (action.type) {
    case RoleActions.ROLELIST_LOAD_SUCCESS: {
      return [...action.payload];
    }

    case RoleActions.ROLE_CREATE_SUCCESS: {
      const newState = [...state];
      newState.push(action.payload);
      return newState;
    }

    case RoleActions.ROLE_UPDATE_SUCCESS: {
      return [...state.map((item: Role) => item._id === action.payload._id ? action.payload : item)];
    }

    case RoleActions.ROLE_REMOVE_SUCCESS: {
      return [...state.filter((item: Role) => item._id !== action.payload.deleted)];
    }
  }

  return <IRolesState>state;

}

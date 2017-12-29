import { Action } from '@ngrx/store';
import { RoleActions } from '../actions/role.actions';

import { Role } from '../../models/role';

export interface IRolesState extends Array<Role> {}

export const initialState: IRolesState = [];

export function reducer (state: any = initialState, action: any): IRolesState {
  switch (action.type) {
    case RoleActions.ROLELIST_LOAD: {
      return Object.assign([], action.payload)
    }

    case RoleActions.ROLELIST_LOAD_SUCCESS: {
      return Object.assign([], action.payload)
    }

    case RoleActions.ROLE_CREATE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.roles.push(action.payload);
      return newState;
    }

    case RoleActions.ROLE_UPDATE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.roles = Object.assign([], state.roles.map((item: Role) => {
        return item._id === action.payload._id ? action.payload : item;
      }));
      return newState;
    }

    case RoleActions.ROLE_REMOVE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.roles = Object.assign([], state.roles.filter((item: Role) => {
        return item._id !== action.payload.deleted;
      }));
      return newState;
    }

    default: {
      return <IRolesState>state;
    }
  }
}

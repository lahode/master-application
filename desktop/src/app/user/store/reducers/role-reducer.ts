import { Action } from '@ngrx/store';
import { RoleActions } from '../actions/role.actions';

import { Role } from '../../models/role';

export interface IRoleState extends Role {}

export const initialState: IRoleState = null;

export function reducer (state: IRoleState = initialState, action: any): IRoleState {
  switch (action.type) {
    case RoleActions.ROLE_NEW: {
      return Object.assign({}, null)
    }

    case RoleActions.ROLE_LOAD: {
      return Object.assign({}, state)
    }

    case RoleActions.ROLE_LOAD_SUCCESS: {
      return Object.assign({}, action.payload);
    }

    case RoleActions.ROLE_CREATE_SUCCESS: {
      return Object.assign({}, action.payload);
    }

    case RoleActions.ROLE_UPDATE_SUCCESS: {
      return Object.assign({}, action.payload);
    }

    case RoleActions.ROLE_REMOVE_SUCCESS: {
      return Object.assign({}, null);
    }

    default: {
      return <IRoleState>state;
    }
  }
}

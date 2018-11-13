import { Action } from '@ngrx/store';
import { RoleActions } from '../actions/role.actions';

import { Role } from '../../../../core/models/role';

export interface IPermissionsState extends Array<Role> {}

export const initialState: IPermissionsState = [];

export function reducer (state: any = initialState, action: any): IPermissionsState {
  switch (action.type) {
    case RoleActions.PERMISSIONLIST_LOAD_SUCCESS: {
      return [...action.payload];
    }
  }

  return <IPermissionsState>state;

}

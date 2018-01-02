import { Action } from '@ngrx/store';

import { IUsersState } from './reducers/users-reducer';
import { IUserState } from './reducers/user-reducer';
import { IRolesState } from './reducers/roles-reducer';
import { IRoleState } from './reducers/role-reducer';
import { IPermissionsState } from './reducers/permissions-reducer';

export interface UserStateI {
  usersList?: IUsersState,
  userEdit?: IUserState,
  rolesList?: IRolesState
  roleEdit?: IRoleState,
  permissionsList?: IPermissionsState
}

export interface UserRecucerStateI {
  usersList?: (state: IUsersState, action: Action) => IUsersState
  userEdit?: (state: IUserState, action: Action) => IUserState
  rolesList?: (state: IRolesState, action: Action) => IRolesState
  roleEdit?: (state: IRoleState, action: Action) => IRoleState
  permissionsList?: (state: IPermissionsState, action: Action) => IPermissionsState
}

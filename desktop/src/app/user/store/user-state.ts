import { Action } from '@ngrx/store';

import { IUsersState } from './reducers/users-reducer';
import { IUserState } from './reducers/user-reducer';
import { IRolesState } from './reducers/roles-reducer';
import { IRoleState } from './reducers/role-reducer';

export interface UserStateI {
  userList?: IUsersState,
  userEdit?: IUserState,
  roleList?: IRolesState
  roleEdit?: IRoleState,
}

export interface UserRecucerStateI {
  userList?: (state: IUsersState, action: Action) => IUsersState
  userEdit?: (state: IUserState, action: Action) => IUserState
  roleList?: (state: IRolesState, action: Action) => IRolesState
  roleEdit?: (state: IRoleState, action: Action) => IRoleState
}

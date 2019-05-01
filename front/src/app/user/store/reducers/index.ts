import { ActionReducerMap } from '@ngrx/store';

import * as fromUsersList from './userslist-reducer';
import * as fromUsers from './users-reducer';
import * as fromUser from './user-reducer';
import * as fromRoles from './roles-reducer';
import * as fromRole from './role-reducer';
import * as fromPermissions from './permissions-reducer';

import { UserStateI, UserRecucerStateI } from '../user-state';

export const reducer: UserRecucerStateI = {
  usersList: fromUsersList.reducer,
  users: fromUsers.reducer,
  userEdit: fromUser.reducer,
  rolesList: fromRoles.reducer,
  roleEdit: fromRole.reducer,
  permissionsList: fromPermissions.reducer,
};

export const reducers: ActionReducerMap<UserStateI> = reducer;

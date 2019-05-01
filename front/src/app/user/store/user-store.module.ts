import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { UserEffects } from './effects/user.effects';
import { RoleEffects } from './effects/role.effects';

import { reducers } from './reducers';

export const UserProviders = [
  UserService,
  RoleService,
];

@NgModule({
  imports: [
    StoreModule.forFeature('usersList', reducers.usersList),
    StoreModule.forFeature('users', reducers.users),
    StoreModule.forFeature('userEdit', reducers.userEdit),
    StoreModule.forFeature('rolesList', reducers.rolesList),
    StoreModule.forFeature('roleEdit', reducers.roleEdit),
    StoreModule.forFeature('permissionsList', reducers.permissionsList),
    EffectsModule.forFeature([UserEffects, RoleEffects]),
  ],
  exports: [
    StoreModule,
    EffectsModule
  ],
  providers: [UserProviders]
})
export class UserStoreModule {
  static forRoot() {
    return {
      ngModule: UserStoreModule,
      providers: [UserProviders]
    };
  }
}

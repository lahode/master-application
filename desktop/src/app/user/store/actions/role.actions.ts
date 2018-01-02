import { Action } from '@ngrx/store';

/**
 * Define every actions for Roles
 */
export const RoleActions = {

  ROLELIST_LOAD_START : 'ROLELIST_LOAD_START',
  ROLELIST_LOAD_SUCCESS : 'ROLELIST_LOAD_SUCCESS',
  ROLELIST_LOAD_FAILED : 'ROLELIST_LOAD_FAILED',

  ROLE_NEW : 'ROLE_NEW',

  ROLE_LOAD_START : 'ROLE_LOAD_START',
  ROLE_LOAD_SUCCESS : 'ROLE_LOAD_SUCCESS',
  ROLE_LOAD_FAILED : 'ROLE_LOAD_FAILED',

  ROLE_CREATE_START : 'ROLE_CREATE_START',
  ROLE_CREATE_SUCCESS : 'ROLE_CREATE_SUCCESS',
  ROLE_CREATE_FAILED : 'ROLE_CREATE_FAILED',

  ROLE_UPDATE_START : 'ROLE_UPDATE_START',
  ROLE_UPDATE_SUCCESS : 'ROLE_UPDATE_SUCCESS',
  ROLE_UPDATE_FAILED : 'ROLE_UPDATE_FAILED',

  ROLE_REMOVE_START : 'ROLE_REMOVE_START',
  ROLE_REMOVE_SUCCESS : 'ROLE_REMOVE_SUCCESS',
  ROLE_REMOVE_FAILED : 'ROLE_REMOVE_FAILED',

  list() {
    return <Action>{
      type: RoleActions.ROLELIST_LOAD_START
    };
  },

  new() {
    return <Action>{
      type: RoleActions.ROLE_NEW
    };
  },

  load(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_LOAD_START,
      payload: _credentials
    };
  },

  create(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_CREATE_START,
      payload: _credentials
    };
  },

  update(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_UPDATE_START,
      payload: _credentials
    };
  },

  remove(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_REMOVE_START,
      payload: _credentials
    };
  },

}

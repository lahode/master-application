import { Action } from '@ngrx/store';

/**
 * Define every actions for Roles
 */
export const RoleActions = {

  ROLELIST_LOAD : 'ROLELIST_LOAD',
  ROLELIST_LOAD_SUCCESS : 'ROLELIST_LOAD_SUCCESS',
  ROLELIST_LOAD_FAILED : 'ROLELIST_LOAD_FAILED',

  ROLE_NEW : 'ROLE_NEW',

  ROLE_LOAD : 'ROLE_LOAD',
  ROLE_LOAD_SUCCESS : 'ROLE_LOAD_SUCCESS',
  ROLE_LOAD_FAILED : 'ROLE_LOAD_FAILED',

  ROLE_IMG_UPLOAD : 'ROLE_IMG_UPLOAD',
  ROLE_IMG_UPLOAD_SUCCESS : 'ROLE_IMG_UPLOAD_SUCCESS',
  ROLE_IMG_UPLOAD_FAILED : 'ROLE_IMG_UPLOAD_FAILED',

  ROLE_CREATE : 'ROLE_CREATE',
  ROLE_CREATE_SUCCESS : 'ROLE_CREATE_SUCCESS',
  ROLE_CREATE_FAILED : 'ROLE_CREATE_FAILED',

  ROLE_UPDATE : 'ROLE_UPDATE',
  ROLE_UPDATE_SUCCESS : 'ROLE_UPDATE_SUCCESS',
  ROLE_UPDATE_FAILED : 'ROLE_UPDATE_FAILED',

  ROLE_REMOVE : 'ROLE_REMOVE',
  ROLE_REMOVE_SUCCESS : 'ROLE_REMOVE_SUCCESS',
  ROLE_REMOVE_FAILED : 'ROLE_REMOVE_FAILED',

  ROLE_ADD_DOCUMENT : 'ROLE_ADD_DOCUMENT',
  ROLE_ADD_DOCUMENT_SUCCESS : 'ROLE_ADD_DOCUMENT_SUCCESS',
  ROLE_ADD_DOCUMENT_FAILED : 'ROLE_ADD_DOCUMENT_FAILED',

  ROLE_REMOVE_DOCUMENT : 'ROLE_REMOVE_DOCUMENT',
  ROLE_REMOVE_DOCUMENT_SUCCESS : 'ROLE_REMOVE_DOCUMENT_SUCCESS',
  ROLE_REMOVE_DOCUMENT_FAILED : 'ROLE_REMOVE_DOCUMENT_FAILED',

  list() {
    return <Action>{
      type: RoleActions.ROLELIST_LOAD
    };
  },

  new() {
    return <Action>{
      type: RoleActions.ROLE_NEW
    };
  },

  load(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_LOAD,
      payload: _credentials
    };
  },

  create(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_CREATE,
      payload: _credentials
    };
  },

  update(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_UPDATE,
      payload: _credentials
    };
  },

  remove(_credentials) {
    return <Action>{
      type: RoleActions.ROLE_REMOVE,
      payload: _credentials
    };
  },

}

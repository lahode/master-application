import { Action } from '@ngrx/store';

/**
 * Define every actions for Users
 */
export const UserActions = {

  USERLIST_LOAD : 'USERLIST_LOAD',
  USERLIST_LOAD_SUCCESS : 'USERLIST_LOAD_SUCCESS',
  USERLIST_LOAD_FAILED : 'USERLIST_LOAD_FAILED',

  USER_NEW : 'USER_NEW',

  USER_LOAD : 'USER_LOAD',
  USER_LOAD_SUCCESS : 'USER_LOAD_SUCCESS',
  USER_LOAD_FAILED : 'USER_LOAD_FAILED',

  USER_IMG_UPLOAD : 'USER_IMG_UPLOAD',
  USER_IMG_UPLOAD_SUCCESS : 'USER_IMG_UPLOAD_SUCCESS',
  USER_IMG_UPLOAD_FAILED : 'USER_IMG_UPLOAD_FAILED',

  USER_CREATE : 'USER_CREATE',
  USER_CREATE_SUCCESS : 'USER_CREATE_SUCCESS',
  USER_CREATE_FAILED : 'USER_CREATE_FAILED',

  USER_UPDATE : 'USER_UPDATE',
  USER_UPDATE_SUCCESS : 'USER_UPDATE_SUCCESS',
  USER_UPDATE_FAILED : 'USER_UPDATE_FAILED',

  USER_REMOVE : 'USER_REMOVE',
  USER_REMOVE_SUCCESS : 'USER_REMOVE_SUCCESS',
  USER_REMOVE_FAILED : 'USER_REMOVE_FAILED',

  USER_ADD_DOCUMENT : 'USER_ADD_DOCUMENT',
  USER_ADD_DOCUMENT_SUCCESS : 'USER_ADD_DOCUMENT_SUCCESS',
  USER_ADD_DOCUMENT_FAILED : 'USER_ADD_DOCUMENT_FAILED',

  USER_REMOVE_DOCUMENT : 'USER_REMOVE_DOCUMENT',
  USER_REMOVE_DOCUMENT_SUCCESS : 'USER_REMOVE_DOCUMENT_SUCCESS',
  USER_REMOVE_DOCUMENT_FAILED : 'USER_REMOVE_DOCUMENT_FAILED',

  list() {
    return <Action>{
      type: UserActions.USERLIST_LOAD
    };
  },

  new() {
    return <Action>{
      type: UserActions.USER_NEW
    };
  },

  load(_credentials) {
    return <Action>{
      type: UserActions.USER_LOAD,
      payload: _credentials
    };
  },

  create(_credentials) {
    return <Action>{
      type: UserActions.USER_CREATE,
      payload: _credentials
    };
  },

  update(_credentials) {
    return <Action>{
      type: UserActions.USER_UPDATE,
      payload: _credentials
    };
  },

  remove(_credentials) {
    return <Action>{
      type: UserActions.USER_REMOVE,
      payload: _credentials
    };
  },

}

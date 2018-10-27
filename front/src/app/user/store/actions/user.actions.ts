import { Action } from '@ngrx/store';

/**
 * Define every actions for Users
 */
export const UserActions = {

  CONFIRM_DIALOG: 'CONFIRM_DIALOG',

  USERLIST_CHANGE_PAGE : 'USERLIST_CHANGE_PAGE',
  USERLIST_CHANGE_PAGE_SUCCESS : 'USERLIST_CHANGE_PAGE_SUCCESS',
  USERLIST_LOAD_START : 'USERLIST_LOAD_START',
  USERLIST_LOAD_SUCCESS : 'USERLIST_LOAD_SUCCESS',
  USERLIST_LOAD_FAILED : 'USERLIST_LOAD_FAILED',

  USER_NEW : 'USER_NEW',

  USER_LOAD_START : 'USER_LOAD_START',
  USER_LOAD_SUCCESS : 'USER_LOAD_SUCCESS',
  USER_LOAD_FAILED : 'USER_LOAD_FAILED',

  USER_CREATE_START : 'USER_CREATE_START',
  USER_CREATE_SUCCESS : 'USER_CREATE_SUCCESS',
  USER_CREATE_FAILED : 'USER_CREATE_FAILED',

  USER_UPDATE_START : 'USER_UPDATE_START',
  USER_UPDATE_SUCCESS : 'USER_UPDATE_SUCCESS',
  USER_UPDATE_FAILED : 'USER_UPDATE_FAILED',

  USER_REMOVE_START : 'USER_REMOVE_START',
  USER_REMOVE_SUCCESS : 'USER_REMOVE_SUCCESS',
  USER_REMOVE_FAILED : 'USER_REMOVE_FAILED',

  confirm(_credentials = null) {
    return <Action>{
      type: UserActions.CONFIRM_DIALOG,
      payload: _credentials
    };
  },

  list(_credentials = null) {
    return <Action>{
      type: UserActions.USERLIST_LOAD_START,
      payload: _credentials
    };
  },

  changePage(_credentials) {
    return <Action>{
      type: UserActions.USERLIST_CHANGE_PAGE,
      payload: _credentials
    };
  },

  new() {
    return <Action>{
      type: UserActions.USER_NEW
    };
  },

  load(_credentials) {
    return <Action>{
      type: UserActions.USER_LOAD_START,
      payload: _credentials
    };
  },

  create(_credentials) {
    return <Action>{
      type: UserActions.USER_CREATE_START,
      payload: _credentials
    };
  },

  update(_credentials) {
    return <Action>{
      type: UserActions.USER_UPDATE_START,
      payload: _credentials
    };
  },

  remove(_credentials) {
    return <Action>{
      type: UserActions.USER_REMOVE_START,
      payload: _credentials
    };
  },

}
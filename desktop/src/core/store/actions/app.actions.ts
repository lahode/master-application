import { Action } from '@ngrx/store';

/**
 * Define every actions globally for application
 */
export const AppActions = {
  CONFIRM_DIALOG: 'CONFIRM_DIALOG',
  CONFIRM_LAUNCH: 'CONFIRM_LAUNCH',
  CONFIRM_RESET: 'CONFIRM_RESET',

  NOERROR : 'NOERROR',
  FAILED: 'FAILED',

  LOADING: 'LOADING',
  LOADED: 'LOADED',

  LANGUAGE: 'LANGUAGE',

  SOCKET_CONNECT: 'SOCKET_CONNECT',
  SOCKET_CONNECTED: 'SOCKET_CONNECTED',
  SOCKET_DISCONNECT: 'SOCKET_DISCONNECT',
  SOCKET_DISCONNECTED: 'SOCKET_DISCONNECTED',

  confirm(_credentials = null) {
    return <Action>{
      type: AppActions.CONFIRM_DIALOG,
      payload: _credentials
    };
  },

  lauchConfirm() {
    return <Action>{
      type: AppActions.CONFIRM_LAUNCH
    };
  },

  resetConfirm() {
    return <Action>{
      type: AppActions.CONFIRM_RESET
    };
  },

  resetError() {
    return <Action>{
      type: AppActions.NOERROR
    };
  },

  setError(_credentials)  {
    return <Action>{
      type: AppActions.FAILED,
      payload: _credentials
    };
  },

  setLanguage(_credentials)  {
    return <Action>{
      type: AppActions.LANGUAGE,
      payload: _credentials
    };
  },

  loading(_credentials)  {
    return <Action>{
      type: AppActions.LOADING,
      payload: _credentials
    };
  },

  loaded(_credentials)  {
    return <Action>{
      type: AppActions.LOADED,
      payload: _credentials
    };
  },

  connectSocket() {
    return <Action>{
      type: AppActions.SOCKET_CONNECT,
    };
  },

  disconnectSocket() {
    return <Action>{
      type: AppActions.SOCKET_DISCONNECT,
    };
  }

}

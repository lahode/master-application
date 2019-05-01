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
  MESSAGE: 'MESSAGE',

  LOADING: 'LOADING',
  LOADED: 'LOADED',

  LANGUAGE: 'LANGUAGE',

  BREADCRUMB: 'BREADCRUMB',

  SETMENU: 'SETMENU',
  ADDTOMENU: 'ADDTOMENU',
  RESETMENU: 'RESETMENU',

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

  launchConfirm() {
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

  setError(_credentials: any)  {
    return <Action>{
      type: AppActions.FAILED,
      payload: _credentials
    };
  },

  setMessage(_credentials: any)  {
    return <Action>{
      type: AppActions.MESSAGE,
      payload: _credentials
    };
  },

  setLanguage(_credentials: any)  {
    return <Action>{
      type: AppActions.LANGUAGE,
      payload: _credentials
    };
  },

  setBreadcrumb(_credentials: any)  {
    return <Action>{
      type: AppActions.BREADCRUMB,
      payload: _credentials
    };
  },

  loading(_credentials: any)  {
    return <Action>{
      type: AppActions.LOADING,
      payload: _credentials
    };
  },

  loaded(_credentials: any)  {
    return <Action>{
      type: AppActions.LOADED,
      payload: _credentials
    };
  },

  setMenu(_credentials: any)  {
    return <Action>{
      type: AppActions.SETMENU,
      payload: _credentials
    };
  },

  addToMenu(_credentials: any)  {
    return <Action>{
      type: AppActions.ADDTOMENU,
      payload: _credentials
    };
  },

  resetMenu() {
    return <Action>{
      type: AppActions.RESETMENU
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
  },
  
  refresh(data: any) {
    if (data.id) {
      return <Action>{
        type: data.type.toUpperCase() + '_REFRESH',
        payload: data.id
      };
    } else {
      return <Action>{
        type: data.type.toUpperCase() + '_REFRESH'
      };
    }
  }

};

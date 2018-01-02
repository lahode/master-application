import { Action } from '@ngrx/store';

/**
 * Define every actions globally for application
 */
export const AppActions = {
  NO_ERROR : 'NO_ERROR',
  ERROR: 'ERROR',
  LOADING: 'LOADING',
  LOADED: 'LOADED',

  resetError() {
    return <Action>{
      type: AppActions.NO_ERROR
    };
  },

  setError(_credentials)  {
    return <Action>{
      type: AppActions.ERROR,
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
  }

}

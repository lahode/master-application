import { Action } from '@ngrx/store';

/**
 * Define every actions globally for application
 */
export const AppActions = {
  ERROR_NULL : 'ERROR_NULL',
  ERROR_SET: 'ERROR_SET',

  resetError() {
    return <Action>{
      type: AppActions.ERROR_NULL
    };
  },

  setError(_credentials)  {
    return <Action>{
      type: AppActions.ERROR_SET,
      payload: _credentials
    };
  }
}

import { Action } from '@ngrx/store';

/**
 * Define every actions globally for application
 */
export const AppActions = {
  ERROR_NULL : 'ERROR_NULL',
  resetError() {
    return <Action>{
      type: AppActions.ERROR_NULL
    };
  }
}

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

/**
 * Define every actions globally for application
 */
@Injectable()
export class AppActions {

  static ERROR_NULL = 'ERROR_NULL';

  resetError(): Action {
    return <Action>{
      type: AppActions.ERROR_NULL
    }
  }
}

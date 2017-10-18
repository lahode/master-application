/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   18-10-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 18-10-2017
 */

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


// TODO: redefine this part like AuthActions
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

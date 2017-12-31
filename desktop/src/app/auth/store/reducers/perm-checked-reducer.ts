import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface IPermCheckedState extends Number {}

export const initialState: IPermCheckedState = -1;

export function reducer (state: IPermCheckedState = initialState, action: any): IPermCheckedState {
  switch (action.type) {
    case AuthActions.CHECK_PERMISSIONS: {
      return -1;
    }

    case AuthActions.CHECK_PERMISSIONS_SUCCESS: {
      return 1;
    }

    case AuthActions.CHECK_PERMISSIONS_FAILED : {
      return 0;
    }

  }
}

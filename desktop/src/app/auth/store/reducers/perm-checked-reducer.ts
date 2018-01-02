import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface IPermCheckedState{}

export const initialState: IPermCheckedState = -1;

export function reducer (state: IPermCheckedState = initialState, action: any): IPermCheckedState {
  switch (action.type) {
    case AuthActions.CHECK_AUTH_SUCCESS: {
      console.log('CHECK_AUTH_SUCCESS into pern-> ', {initialState,state})
      return state;
    }
    case AuthActions.CHECK_PERMISSIONS: {
      return -1;
    }

    case AuthActions.CHECK_PERMISSIONS_SUCCESS: {
      return 1;
    }

    case AuthActions.CHECK_PERMISSIONS_FAILED : {
      return 2;
    }

  }
  console.log('XXXX->',state)
  return state;
}

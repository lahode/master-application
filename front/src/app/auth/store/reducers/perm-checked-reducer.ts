import { AuthActions } from '../actions/auth.actions';

export interface IPermCheckedState extends Boolean {}

export const initialState: IPermCheckedState = false;

export function reducer (state: IPermCheckedState = initialState, action: any): IPermCheckedState {
  switch (action.type) {
    case AuthActions.CHECK_PERMISSIONS_SUCCESS: {
      return true;
    }

    case AuthActions.CHECK_PERMISSIONS_FAILED : {
      return false;
    }
  }

  return <IPermCheckedState>state;

}

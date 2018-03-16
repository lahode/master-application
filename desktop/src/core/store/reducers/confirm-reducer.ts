import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

export interface IConfirmState extends String {}

export const initialState: IConfirmState = null;

export function reducer (state: IConfirmState = initialState, action: any): IConfirmState {
  switch (action.type) {
    case AppActions.CONFIRM_DIALOG: {
      return Object.assign({}, action.payload);
    }

    case AppActions.CONFIRM_LAUNCH:
    case AppActions.CONFIRM_RESET: {
      return Object.assign({}, null);
    }
  }

  return <IConfirmState>state;

}

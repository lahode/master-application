import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

export interface IErrorState extends String {}

export const initialState: IErrorState = null;

export function reducer (state: IErrorState = initialState, action: any): IErrorState {
  const actionTab = action.type.split('_');
  switch (actionTab[actionTab.length - 1]) {
    case 'FAILED' : {
      // Assign only one error at the time
      if (!state) {
        return Object.assign(action.payload);
      } else {
        return <IErrorState>state;
      }
    }

    case 'NOERROR' : {
      return null;
    }

  }

  return <IErrorState>state;

}

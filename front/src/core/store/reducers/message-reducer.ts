import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

export interface IMessageState extends String {}

export const initialState: IMessageState = null;

export function reducer (state: IMessageState = initialState, action: any): IMessageState {
  const actionTab = action.type.split('_');
  switch (actionTab[actionTab.length - 1]) {
    case 'FAILED' : {
      // Assign only one error at the time
      if (!state) {
        return Object.assign({data: action.payload, type: 'error'});
      } else {
        return <IMessageState>state;
      }
    }

    case 'MESSAGE' : {
      // Assign only one error at the time
      if (!state) {
        return Object.assign({data: action.payload, type: 'confirm'});
      } else {
        return <IMessageState>state;
      }
    }

    case 'NOERROR' : {
      return null;
    }

  }

  return <IMessageState>state;

}

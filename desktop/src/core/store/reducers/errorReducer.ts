import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

export interface IErrorState extends String {}

export const intitialState: IErrorState = null;

export function reducer (state: IErrorState = intitialState, action: any): IErrorState {
  const actionTab = action.type.split('_');
  switch (actionTab[actionTab.length - 1]) {
    case 'FAILED' : {
      return Object.assign(action.payload);
    }
  }

  return <IErrorState>state;

}

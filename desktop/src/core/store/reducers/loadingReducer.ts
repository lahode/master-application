import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

export interface ILoadingState extends Array<string> {};

export const initialState: ILoadingState = [];

export function reducer (state: ILoadingState = initialState, action: any): ILoadingState {
  const actionTab = action.type.split('_');
  const actionType = actionTab.pop();
  const actionName = actionTab.join('_');
  switch (actionType) {
    case 'START': {
      return Object.assign([], [...state, actionName]);
    }

    case 'SUCCESS' :
    case 'STOP' :
    case 'FAILED' : {
      return Object.assign([], [...state.filter((item: string) => {
        return item !== actionName;
      })]);
    }
  }

  return <ILoadingState>state;

}

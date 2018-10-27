import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

export const initialState = 'en';

export function reducer (state: string = initialState, action: any): string {
  switch (action.type) {
    case AppActions.LANGUAGE: {
      return action.payload;
    }
  }

  return <string>state;

}

import { Action } from '@ngrx/store';
import { AuthActions } from '../../../app/auth/store';

export interface IqueryParamsState {
  queryParams: {
    path: string,
    params?: Object
  };
}

export const intitialState: IqueryParamsState = {
  queryParams: {path: '/'}
};

export function reducer (state: IqueryParamsState = intitialState, action: any): IqueryParamsState {
  switch (action.type) {
    case AuthActions.LOGOUT_SUCCESS: {
      return Object.assign({}, intitialState);
    }
    default: {
      return <IqueryParamsState>state;
    }
  }
}

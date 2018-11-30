import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

export interface ISocketState extends Boolean {}

export const initialState: ISocketState = false;

export function reducer (state: ISocketState = initialState, action: any): ISocketState {
  switch (action.type) {
    case AppActions.SOCKET_CONNECTED: {
      return true;
    }

    case AppActions.SOCKET_DISCONNECTED: {
      return false;
    }
  }

  return <ISocketState>state;

}

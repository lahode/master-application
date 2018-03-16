import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { AppActions } from '../actions/app.actions';
import { SocketService } from '../../services/socket.service';

@Injectable()
export class AppEffects {

  // Listen for the 'SOCKET_CONNECT' action
  @Effect() appSocketConnectAction$ = this.action$
    .ofType(AppActions.SOCKET_CONNECT)
    .map<Action, any>(toPayload)
    .switchMap(() => this._socket.connect()
      // If successful, dispatch SOCKET_CONNECTED
      .map<Action, any>((_result: any) => {
        const type = _result ? AppActions.SOCKET_CONNECTED : AppActions.SOCKET_DISCONNECTED;
        return <Action>{ type, payload: _result };
      })
        // On errors dispatch SOCKET_DISCONNECTED action with result
      .catch((res: any) => Observable.of({ type: AppActions.SOCKET_DISCONNECTED, payload: res }))
    );

  // Listen for the 'SOCKET_DISCONNECT' action
  @Effect() appSocketDisconnectAction$ = this.action$
    .ofType(AppActions.SOCKET_DISCONNECT)
    .map<Action, any>(toPayload)
    .switchMap(() => this._socket.connect()
      // If successful, dispatch SOCKET_DISCONNECTED
      .map<Action, any>((_result: any) => <Action>{ type: AppActions.SOCKET_DISCONNECTED, payload: _result })
    );

  constructor(
    private action$: Actions,
    private _socket: SocketService
  ) {}

}

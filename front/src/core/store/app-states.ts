import { Action } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

import { IBreadcrumbState } from './reducers/breadcrumb-reducer';
import { IConfirmState } from './reducers/confirm-reducer';
import { ILoadingState } from './reducers/loading-reducer';
import { IMenuLinksState } from './reducers/menulinks-reducer';
import { IMessageState } from './reducers/message-reducer';
import { ISocketState } from './reducers/socket-reducer';

export interface AppStateI {
  breadcrumb?: IBreadcrumbState;
  confirm?: IConfirmState;
  language?: string;
  loading?: ILoadingState;
  menuLinks?: IMenuLinksState;
  message?: IMessageState;
  router?: RouterReducerState;
  socket?: ISocketState;
}

export interface AppReducerStateI {
  breadcrumb?: (state: IBreadcrumbState, action: Action) => IBreadcrumbState;
  confirm?: (state: IConfirmState, action: Action) => IConfirmState;
  language?: (state: string, action: Action) => string;
  loading?: (state: ILoadingState, action: Action) => ILoadingState;
  menuLinks?: (state: IMenuLinksState, action: Action) => IMenuLinksState;
  message?: (state: IMessageState, action: Action) => IMessageState;
  router?: (state: RouterReducerState, action: Action) => RouterReducerState;
  socket?: (state: ISocketState, action: Action) => ISocketState;
}

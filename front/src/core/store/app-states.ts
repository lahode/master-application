import { Action } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

import { ILoadingState } from './reducers/loading-reducer';
import { IBreadcrumbState } from './reducers/breadcrumb-reducer';
import { IErrorState } from './reducers/error-reducer';
import { IConfirmState } from './reducers/confirm-reducer';
import { IMenuLinksState } from './reducers/menulinks-reducer';
import { IMessageState } from './reducers/message-reducer';
import { ISocketState } from './reducers/socket-reducer';

export interface AppStateI {
  router: RouterReducerState;
  loading: ILoadingState;
  error?: IErrorState;
  language?: string;
  breadcrumb?: IBreadcrumbState;
  confirm?: IConfirmState;
  menuLinks?: IMenuLinksState;
  message?: IMessageState;
  socket?: ISocketState;
}

export interface AppReducerStateI {
  router: (state: RouterReducerState, action: Action) => RouterReducerState;
  loading: (state: ILoadingState, action: Action) => ILoadingState;
  error?: (state: IErrorState, action: Action) => IErrorState;
  language?: (state: string, action: Action) => string;
  breadcrumb?: (state: IBreadcrumbState, action: Action) => IBreadcrumbState;
  confirm?: (state: IConfirmState, action: Action) => IConfirmState;
  menuLinks?: (state: IMenuLinksState, action: Action) => IMenuLinksState;
  message?: (state: IMessageState, action: Action) => IMessageState;
  socket?: (state: ISocketState, action: Action) => ISocketState;
}

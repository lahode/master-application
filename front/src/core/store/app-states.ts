import { Action } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

import { ILoadingState } from './reducers/loading-reducer';
import { IErrorState } from './reducers/error-reducer';
import { IConfirmState } from './reducers/confirm-reducer';
import { ISocketState } from './reducers/socket-reducer';
import { IBreadcrumbState } from './reducers/breadcrumb-reducer';

export interface AppStateI {
  router: RouterReducerState;
  loading: ILoadingState;
  error?: IErrorState;
  language?: string;
  breadcrumb?: IBreadcrumbState;
  confirm?: IConfirmState;
  socket?: ISocketState;
}

export interface AppReducerStateI {
  router: (state: RouterReducerState, action: Action) => RouterReducerState;
  loading: (state: ILoadingState, action: Action) => ILoadingState;
  error?: (state: IErrorState, action: Action) => IErrorState;
  language?: (state: string, action: Action) => string;
  breadcrumb?: (state: IBreadcrumbState, action: Action) => IBreadcrumbState;
  confirm?: (state: IConfirmState, action: Action) => IConfirmState;
  socket?: (state: ISocketState, action: Action) => ISocketState;
}

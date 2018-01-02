import { Action } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

import { ILoadingState } from './reducers/loadingReducer';
import { IErrorState } from './reducers/errorReducer';

export interface AppStateI {
  router: RouterReducerState,
  loading: ILoadingState,
  error?: IErrorState
}

export interface AppRecucerStateI {
  router: (state: RouterReducerState, action: Action) => RouterReducerState,
  loading: (state: ILoadingState, action: Action) => ILoadingState,
  error?: (state: IErrorState, action: Action) => IErrorState
}

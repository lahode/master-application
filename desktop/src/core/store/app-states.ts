import { Action } from '@ngrx/store';

import { IqueryParamsState } from './reducers/queryParamsReducer';
import { ILoadingState } from './reducers/loadingReducer';
import { ILoadedState } from './reducers/loadedReducer';
import { IErrorState } from './reducers/errorReducer';

export interface AppStateI {
  loading: ILoadingState,
  loaded: ILoadedState,
  queryParams: IqueryParamsState,
  error?: IErrorState
}

export interface AppRecucerStateI {
  loading: (state: ILoadingState, action: Action) => ILoadingState,
  loaded: (state: ILoadedState, action: Action) => ILoadedState,
  queryParams: (state: IqueryParamsState, action: Action) => IqueryParamsState,
  error?: (state: IErrorState, action: Action) => IErrorState
}

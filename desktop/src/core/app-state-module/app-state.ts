import { Action } from '@ngrx/store';

import { IqueryParamsState } from './reducers/queryParamsReducer';
import { ILoadingState } from './reducers/loadingReducer';
import { ILoadedState } from './reducers/loadedReducer';
import { IAuthCheckedState } from './reducers/authCheckedReducer';
import { IErrorState } from './reducers/errorReducer';
import { ICurrentUserState } from './reducers/currentUserReducer';

export interface AppStateI {
  loading: ILoadingState,
  loaded: ILoadedState,
  authCheck: IAuthCheckedState,
  queryParams: IqueryParamsState,
  currentUser?: ICurrentUserState,
  error?: IErrorState
}

export interface RecucerStateI {
  loading: (state: ILoadingState, action: Action) => ILoadingState,
  loaded: (state: ILoadedState, action: Action) => ILoadedState,
  authCheck: (state: IAuthCheckedState, action: Action) => IAuthCheckedState,
  queryParams: (state: IqueryParamsState, action: Action) => IqueryParamsState,
  currentUser?: (state: ICurrentUserState, action: Action) => ICurrentUserState,
  error?: (state: IErrorState, action: Action) => IErrorState
}

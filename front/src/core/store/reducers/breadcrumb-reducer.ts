import { Action } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';

import { Breadcrumb } from '../../models/breadcrumb';

export interface IBreadcrumbState extends Array<Breadcrumb> {}

export const initialState: IBreadcrumbState = null;

export function reducer (state: IBreadcrumbState = initialState, action: any): IBreadcrumbState {

  switch (action.type) {

    case AppActions.BREADCRUMB: {
      return Object.assign([], action.payload);
    }
  }

  return <IBreadcrumbState>state;

}

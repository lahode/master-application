import { AppActions } from '../actions/app.actions';

import { MenuLink } from '../../models/menu-link';

export interface IMenuLinksState extends Array<MenuLink> {}

export const initialState: IMenuLinksState = [];

export function reducer (state: IMenuLinksState = initialState, action: any): IMenuLinksState {
  switch (action.type) {
    case AppActions.SETMENU: {
      return action.payload;
    }

    case AppActions.ADDTOMENU: {
      return [...state, action.payload];
    }

    case AppActions.RESETMENU: {
      return [];
    }
  }

  return <IMenuLinksState>state;

}

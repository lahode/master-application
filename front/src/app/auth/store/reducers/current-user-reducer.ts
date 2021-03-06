import { AuthActions } from '../actions/auth.actions';
import { UserActions } from '../../../user/store/actions/user.actions';

export interface ICurrentUserState extends Object {}

export const initialState: ICurrentUserState = null;

export function reducer (state: ICurrentUserState = initialState, action: any): ICurrentUserState {
  switch (action.type) {

    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.CHECK_AUTH_SUCCESS:
    case AuthActions.CREATE_USER_SUCCESS:
    case UserActions.PROFILE_UPDATE_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }

    case AuthActions.LOGIN_FAILED:
    case AuthActions.CHECK_AUTH_STOP:
    case AuthActions.CHECK_AUTH_FAILED:
    case AuthActions.LOGOUT_SUCCESS: {
      return null;
    }
  }

  return <ICurrentUserState>state;

}

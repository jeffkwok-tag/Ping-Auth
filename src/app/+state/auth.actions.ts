import { createAction, props } from '@ngrx/store';
import { AuthUser } from '../models/auth.user';

const NAMESPACE = '[Auth]';

const init = createAction('[Auth] Init');

const refresh = createAction(
  `${NAMESPACE} Refresh`,
  props<{ authUser: AuthUser; isAuthenticated: boolean; }>()
);

const login = createAction(`${NAMESPACE} Login`);

const loginSuccess = createAction(
  `${NAMESPACE} Login Success`,
  props<{ authUser: AuthUser; isAuthenticated: boolean }>()
);

const loginFailed = createAction(`${NAMESPACE} Login Failed`);

const logout = createAction(`${NAMESPACE} Logout`);

const logoutConfirmed = createAction(`${NAMESPACE} Logout Confirmed`);

const hubConnected = createAction(`${NAMESPACE} Hub Connected`);

const refreshToken = createAction(`${NAMESPACE} Refresh Token`);

export const authActions = {
  init,
  refresh,
  login,
  loginSuccess,
  loginFailed,
  logout,
  logoutConfirmed,
  hubConnected,
  refreshToken,
};

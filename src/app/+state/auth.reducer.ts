import { AuthUser } from "../models/auth.user";

import { authActions } from "./auth.actions";
import { Action, createReducer, on } from "@ngrx/store";

export interface State {
  isAuthenticated: boolean;
  loggingIn: boolean;
  loggingInComplete: boolean;
  user: AuthUser | null;
}

export const initialState: State = {
  isAuthenticated: false,
  user: null,
  loggingIn: false,
  loggingInComplete: false,
};

const r = createReducer(
  initialState,

  on(authActions.refresh, authActions.loginSuccess, (state, action) => ({
    ...state,
    isAuthenticated: action.isAuthenticated,
    loggingIn: false,
    loggingInComplete: true,
    user: action.authUser,
  })),

  on(authActions.login, (state) => ({
    ...state,
    loggingIn: true,
    loggingInComplete: false,
  })),

  on(authActions.loginFailed, () => initialState),

  on(authActions.logout, (state) => ({ ...state })),

  on(authActions.logoutConfirmed, () => initialState)
);

export function authReducer(state: State | undefined, action: Action) {
  return r(state, action);
}

export const getIsAuthenticated = (state: State) => state.isAuthenticated;

export const getLoggingIn = (state: State) => state.loggingIn;

export const getLoggingInComplete = (state: State) => state.loggingInComplete;

export const getUser = (state: State) => state.user;

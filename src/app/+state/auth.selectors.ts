import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as AuthReducer from "./auth.reducer";
import { State } from "./auth.reducer";

export const selectState = createFeatureSelector<AuthReducer.State>("auth");

const selectIsAuthenticated = createSelector(
  selectState,
  AuthReducer.getIsAuthenticated
);

const selectLoggingIn = createSelector(selectState, AuthReducer.getLoggingIn);

const selectLoggingIncomplete = createSelector(
  selectState,
  AuthReducer.getLoggingInComplete
);

const selectUserData = createSelector(selectState, AuthReducer.getUser);

const selectUserName = createSelector(
  selectState,
  (state: State) => state.user?.givenName
);

export const authQuery = {
  selectState,
  selectIsAuthenticated,
  selectLoggingIn,
  selectLoggingIncomplete,
  selectUserData,
  selectUserName,
};

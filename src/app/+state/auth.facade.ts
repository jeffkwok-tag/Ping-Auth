import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "./auth.reducer";
import { authActions } from "./auth.actions";
import { AuthUser } from "../models/auth.user";
import { authQuery } from "./auth.selectors";

@Injectable()
export class AuthFacade {
  state$ = this.store.select(authQuery.selectState);
  user$ = this.store.select(authQuery.selectUserData);
  loggingIn$ = this.store.select(authQuery.selectLoggingIn);
  loggingInComplete$ = this.store.select(authQuery.selectLoggingIncomplete);
  isAuthenticated$ = this.store.select(authQuery.selectIsAuthenticated);

  constructor(private store: Store<State>) {}

  init() {
    console.log("i was called");
    this.store.dispatch(authActions.init());
  }

  login() {
    console.log("login was called");
    this.store.dispatch(authActions.login());
  }

  logout() {
    this.store.dispatch(authActions.logout());
  }

  refresh(authUser: AuthUser, isAuthenticated: boolean) {
    this.store.dispatch(
      authActions.refresh({
        authUser,
        isAuthenticated,
      })
    );
  }

  loginFailed() {
    this.store.dispatch(authActions.loginFailed());
  }

  loginSuccess(authUser: AuthUser, isAuthenticated: boolean) {
    this.store.dispatch(
      authActions.loginSuccess({
        authUser,
        isAuthenticated,
      })
    );
  }

  hubConnected() {
    this.store.dispatch(authActions.hubConnected());
  }
}

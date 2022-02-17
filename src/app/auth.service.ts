import { Inject, Injectable } from "@angular/core";
import { OAuthErrorEvent, OAuthEvent, OAuthService } from "angular-oauth2-oidc";
import jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { AuthUser } from "./models/auth.user";
import { AuthFacade } from "./+state/auth.facade";
import { AuthorizationConfig } from './authorization_config';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

@UntilDestroy()
@Injectable()
export class AuthService {

  config = {
    issuer: "https://auth.pingone.ca/662705cd-75fd-4eb2-992a-d5ad63567e3e/as",
    redirectUri: "https://localhost:4200/callback",
    clientId: "7690b91f-b39f-461b-9638-9f837ca99ea9",
    scope: "openid",
    responseType: 'code',
    postLogoutRedirectUri: 'https://localhost:4200',
    showDebugInformation: true,
    timeoutFactor: 0.5,
    dummyClientSecret: 'NKDtdUQ.e0PPwE1q78RWxmQXRE5xGylQpoOqT-ZmLepwX_L.Y7V~4XHG33uklr8f',
    code: "18b2299e-4ec4-4787-b20e-420c4326799c",
    code_verifier: "otGn9ni3QHtPKx2HVkccLNrJCCTqiPBQLKORZCumg9qDBWXcG39chYdBnmLH0gAxADnCDqQdPhmD0XFJ5o8GsfLIs7hG6LSjIEDzAKsH9cvFU2CCtZuhTEgb4XVoXqgm"
  };

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private route: ActivatedRoute,
    private oauthService: OAuthService,
    @Inject("AuthorizationConfig") private environment: AuthorizationConfig
  ) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(this.config);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
  }

  init() {
    this.authFacade.login();

    this.oauthService.events
      .pipe(untilDestroyed(this))
      .subscribe((event: OAuthEvent) => {
        if (event instanceof OAuthErrorEvent) {
          this.onError();
        }

        if (event.type === "token_refreshed") {
          this.refresh();
        }
      });

    this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then((val: boolean) => {
        if (val) {
          this.loginSuccess();

          location.hash = "";

          return Promise.resolve();
        } else {
          this.loginFailedOnDiscovery();
          return null;
        }
      })
      .catch((error) => {
        this.authFacade.loginFailed();
      });
  }

  public logout() {
    this.oauthService.logOut();
  }

  onError() {
    this.authFacade.logout();
  }

  loginSuccess() {
    this.oauthService.setupAutomaticSilentRefresh();

    const authUser = this.getAuthUSerFromToken();

    this.authFacade.loginSuccess(authUser, true);
  }

  loginFailedOnDiscovery() {
    localStorage.setItem(
      "callback",
      JSON.stringify({
        pathname: window.location.pathname,
        search: window.location.search,
      })
    );
  }

  refresh() {
    const authUser = this.getAuthUSerFromToken();

    this.authFacade.refresh(authUser, true);
  }

  refreshToken() {
    this.oauthService.refreshToken();
  }

  getAuthUSerFromToken(): AuthUser {
    const claims: any = jwt_decode(this.oauthService.getAccessToken());

    return {
      email: claims.email,
      givenName: claims.given_name,
      displayName: claims.display_name,
      id: claims.sub,
      idToken: this.oauthService.getIdToken(),
      accessToken: this.oauthService.getAccessToken(),
    };
  }
}

import { Inject, Injectable, Optional } from "@angular/core";
import { OAuthErrorEvent, OAuthEvent, OAuthService } from "angular-oauth2-oidc";
import jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { AuthUser } from "./models/auth.user";
import { AuthFacade } from "./+state/auth.facade";
import { AuthorizationConfig } from './authorization_config';
import { AuthorizationService } from './authorization.service';
import { GRANT_TYPE_AUTHORIZATION_CODE } from '@openid/appauth';

@UntilDestroy()
@Injectable()
export class AuthService {

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private route: ActivatedRoute,
    private oauthService: OAuthService,
    private authorizationService: AuthorizationService,
    @Inject("AuthorizationConfig") private environment: AuthorizationConfig
  ) {
    const config = {
      issuer: "https://auth.pingone.ca/662705cd-75fd-4eb2-992a-d5ad63567e3e/as",
      redirectUri: "https://localhost:4200/callback",
      clientId: "7690b91f-b39f-461b-9638-9f837ca99ea9",
      scope: "openid",
      responseType: 'code',
      postLogoutRedirectUri: 'https://localhost:4200',
      showDebugInformation: true,
      timeoutFactor: 0.5,
      dummyClientSecret: 'NKDtdUQ.e0PPwE1q78RWxmQXRE5xGylQpoOqT-ZmLepwX_L.Y7V~4XHG33uklr8f'
    };
    this.oauthService.configure(config);
  }

  init() {
    console.log("hello from auth service")
    this.authFacade.login();

    this.oauthService.events
      .pipe(untilDestroyed(this))
      .subscribe((event: OAuthEvent) => {
        console.log(event);
        if (event instanceof OAuthErrorEvent) {
          console.log("THERE IS AN ERROR");
          this.onError();
        }

        if (event.type === "token_refreshed") {
          console.log("TOKEN IS REFRESHED");
          this.refresh();
        }
      });

    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then((val: boolean) => {
        if (val) {
          console.log(val);
          console.log("LOGIN WAS A SUCCESS");
          this.loginSuccess();

          location.hash = "";

          return Promise.resolve();
        } else {
          console.log("LOGIN WAS AN EPIC FAILURE");
          this.loginFailedOnDiscovery();
          return null;
        }
      })
      .catch((error) => {
        console.log(error);

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
    console.log("in loginSuccess method")

    this.oauthService.setupAutomaticSilentRefresh();
    this.getToken();

    // const authUser = this.getAuthUSerFromToken();

    // console.log("LOGIN SUCCESS AUTH USER IS: ", authUser);

    // this.authFacade.loginSuccess(authUser, true);
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

  getToken() {
    
    console.log(GRANT_TYPE_AUTHORIZATION_CODE)
    const params = {
      client_secret: "NKDtdUQ.e0PPwE1q78RWxmQXRE5xGylQpoOqT-ZmLepwX_L.Y7V~4XHG33uklr8f",
      client_id: "7690b91f-b39f-461b-9638-9f837ca99ea9",
      // redirect_uri: "https://localhost:4200/callback",
      code: "18b2299e-4ec4-4787-b20e-420c4326799c",
      code_verifier: "otGn9ni3QHtPKx2HVkccLNrJCCTqiPBQLKORZCumg9qDBWXcG39chYdBnmLH0gAxADnCDqQdPhmD0XFJ5o8GsfLIs7hG6LSjIEDzAKsH9cvFU2CCtZuhTEgb4XVoXqgm"
    }

    this.oauthService.fetchTokenUsingGrant('Authorization Code', params).then((response) => {
      console.log(response);
    });
  }

  getAuthUSerFromToken(): AuthUser {
    console.log("in here")
    console.log(this.oauthService.getAccessToken());
    const claims: any = jwt_decode(this.oauthService.getAccessToken());

    console.log("CLAIMS: ", claims);

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

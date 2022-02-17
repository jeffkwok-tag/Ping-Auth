// Copyright 2018 Ping Identity
//
// Licensed under the MIT License (the "License"); you may not use this file
// except in compliance with the License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as $ from "jquery";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";

import { Requestor, FetchRequestor } from "@openid/appauth";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthenticationComponent } from "./authentication/authentication.component";
import { AuthorizationService } from "./authorization.service";
import { CallbackComponent } from "./callback/callback.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { IntroComponent } from "./intro/intro.component";
import { MetadataComponent } from "./metadata/metadata.component";

import { environment } from "../environments/environment";
import { AuthorizationConfig } from "./authorization_config";
import { IntroDisplayService } from "./intro-display.service";
import { OAuthModule } from "angular-oauth2-oidc";
import { StoreModule } from "@ngrx/store";

import { authReducer } from "./+state/auth.reducer";
import { AuthEffects } from "./+state/auth.effects";
import { EffectsModule } from "@ngrx/effects";
import { AuthService } from "./auth.service";
import { AuthFacade } from "./+state/auth.facade";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthResolver } from './auth.resolver';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    CallbackComponent,
    DashboardComponent,
    IntroComponent,
    MetadataComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    AppRoutingModule,
    HttpClientModule,

    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [
          // "https://demo-api.mfm.ag/api/1",
          // "https://qa-api.mfm.ag/api/1",
          // "https://qadata-api.mfm.ag/api/1",
          // "https://decisive-mobile-api.azurewebsites.net/api/1",
          // "https://decisive-prod-api-pre-prod.azurewebsites.net/api/1",
          // "https://api.mfm.ag/api/1",
          // "https://release-api.mfm.ag/api/1",
          // "http://localhost:6002/api/1",
          // "http://api.mfm-local.ag:6002/api/1",
          "https://auth.pingone.ca/662705cd-75fd-4eb2-992a-d5ad63567e3e/as",
        ],
        sendAccessToken: true,
      },
    }),

    StoreModule.forRoot(
      {auth: authReducer},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
        },
      }
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // DONT COMMIT ME
      name: 'Testing',
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([AuthEffects]),
  ],
  providers: [
    AuthorizationService,
    AuthService,
    IntroDisplayService,
    AuthEffects,
    AuthFacade,
    AuthResolver,
    {provide: Requestor, useValue: new FetchRequestor()},
    {provide: "AuthorizationConfig", useValue: environment},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

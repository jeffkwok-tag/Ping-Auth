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

import { Component, OnInit } from "@angular/core";
import { UserInfo } from "../userinfo";
// import { TokenResponse } from "@openid/appauth";
import { AuthFacade } from "../+state/auth.facade";
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth.user';

// import { AuthorizationService } from '../authorization.service';

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"],
})
export class AuthenticationComponent implements OnInit {
  public userInfo: UserInfo | null;
  public authorized: boolean;

  isAuthenticated$: Observable<boolean>;
  userInfo$: Observable<AuthUser | null>;

  constructor(
    // public authorizationService: AuthorizationService,
    public authFacade: AuthFacade
  ) {
    this.userInfo = null;
    this.authorized = false;
    this.isAuthenticated$ = this.authFacade.isAuthenticated$;
    this.userInfo$ = this.authFacade.user$;
    // this.authFacade.init();
  }

  ngOnInit() {
    // this.authorizationService
    //   .userInfos()
    //   .subscribe((userInfo: UserInfo | null) => {
    //     console.log(userInfo);
    //     this.userInfo = userInfo;
    //   });
    // this.authorizationService
    //   .tokenResponse()
    //   .subscribe((tokenResponse: TokenResponse | null) => {
    //     console.log(tokenResponse);
    //     this.authorized = tokenResponse != null;
    //   });
  }
}

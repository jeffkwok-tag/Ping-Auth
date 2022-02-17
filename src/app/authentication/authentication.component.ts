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
import { AuthFacade } from "../+state/auth.facade";
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth.user';

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"],
})
export class AuthenticationComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  userInfo$: Observable<AuthUser | null>;

  constructor(
    public authFacade: AuthFacade
  ) {
    this.isAuthenticated$ = this.authFacade.isAuthenticated$;
    this.userInfo$ = this.authFacade.user$;
  }

  ngOnInit() {
    this.isAuthenticated$.subscribe((val) => console.log("authenticated", val))
    this.userInfo$.subscribe((val) => console.log("userinfo", val))
  }

  login() {
    this.authFacade.init();
  }
}

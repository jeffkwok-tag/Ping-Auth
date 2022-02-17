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

import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { combineLatest, Observable } from 'rxjs';
import { AuthFacade } from '../+state/auth.facade';
import { AuthUser } from '../models/auth.user';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: "app-callback",
  templateUrl: "./callback.component.html",
  styleUrls: ["./callback.component.scss"],
})
export class CallbackComponent implements AfterViewInit {
  isAuthenticated$: Observable<boolean>;
  userInfo$: Observable<AuthUser | null>;

  constructor(
    public authFacade: AuthFacade,
    public router: Router
  ) {
    this.isAuthenticated$ = this.authFacade.isAuthenticated$;
    this.userInfo$ = this.authFacade.user$;
  }

  ngAfterViewInit() {
    if (!window.location.hash || window.location.hash.length === 0) {
      const queryString = window.location.search.substring(1); // substring strips '?'
      const path = [window.location.pathname, queryString].join("#");
      window.location.assign(new URL(path, window.location.href).toString());
    } else if (
      new URLSearchParams(window.location.hash.substring(1)).has("code")
    ) {
      combineLatest([
        this.isAuthenticated$,
        this.userInfo$
      ]).pipe(
        untilDestroyed(this),
      ).subscribe(([isAuthenticated, user]: [boolean, AuthUser | null]) => {
        if (isAuthenticated && user) {
          this.router.navigate(["dashboard"])
        } else {
          this.authFacade.init();
        }
      })
    } else {
      this.router.navigate(["dashboard"]);
    }
  }
}

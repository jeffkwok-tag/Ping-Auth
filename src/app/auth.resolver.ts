import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { AuthFacade } from './+state/auth.facade';
import { State } from './+state/auth.reducer';

@Injectable()
export class AuthResolver implements Resolve<any> {
  loading = false;

  constructor(private authFacade: AuthFacade) {
    console.log("INSIDE AUTH RESOLVER")
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.authFacade.state$.pipe(
      tap((authState: State) => {
        if (!this.loading && !authState.isAuthenticated) {
          this.loading = true;
          this.authFacade.init();
        }
      }),
      filter((authState: State) => authState.isAuthenticated),
      first(),
      finalize(() => (this.loading = false))
    );
  }
}

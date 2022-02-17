import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { AuthService } from "../auth.service";
import { authActions } from "./auth.actions";

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );

  init$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.init),
        tap(() => this.authService.init())
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.refreshToken),
        tap(() => this.authService.refreshToken())
      ),
    { dispatch: false }
  );
}

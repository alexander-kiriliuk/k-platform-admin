/*
 * Copyright 2023 Alexander Kiriliuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {ProfileService} from "./modules/profile/profile.service";
import {finalize, throwError} from "rxjs";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {Store} from "./modules/store/store";
import {JwtDto} from "./auth/auth.types";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AuthEvent} from "./auth/auth.event";
import {AuthService} from "./auth/auth.service";
import {TranslocoService} from "@ngneat/transloco";
import {LangUtils} from "./global/util/lang.utils";
import getCurrentLang = LangUtils.getCurrentLang;

@UntilDestroy()
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  ready: boolean;

  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly ts: TranslocoService,
    private readonly profileService: ProfileService) {
    this.store.on<JwtDto>(AuthEvent.Success)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.checkProfile());
    this.store.on<JwtDto>(AuthEvent.Logout)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.logout());
    this.ts.setActiveLang(getCurrentLang());
  }

  ngOnInit(): void {
    this.checkProfile();
  }

  private logout() {
    this.authService.logout().pipe(
      catchError((error) => {
        // todo show popup
        return throwError(() => error);
      })
    ).subscribe(() => {
      this.router.navigate(["/auth"]);
    });
  }

  private checkProfile() {
    this.profileService.currentUser().pipe(
      finalize(() => {
        this.doc.body.classList.remove("pending");
        this.ready = true;
        this.cdr.markForCheck();
      }),
      catchError((error) => {
        this.router.navigate(["/auth"]);
        return throwError(() => error);
      })
    ).subscribe(() => {
      // todo create global state for current user?
      this.router.navigate(["/dashboard"]);
    });
  }

}


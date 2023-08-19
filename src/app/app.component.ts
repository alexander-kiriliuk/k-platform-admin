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

import {Component, Inject, OnInit} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {ProfileService} from "./modules/profile/profile.service";
import {finalize, throwError} from "rxjs";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {Store} from "./modules/store/store";
import {JwtDto} from "./auth/auth.types";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AuthEvent} from "./auth/auth.event";

@UntilDestroy()
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    private readonly router: Router,
    private readonly store: Store,
    private readonly profileService: ProfileService) {
    this.store.on<JwtDto>(AuthEvent.Success)
      .pipe(untilDestroyed(this))
      .subscribe(msg => {
        console.log(msg.payload.accessToken);
        // todo save tokens to? or set cookies?
        this.checkProfile();
      });
  }

  ngOnInit(): void {
    this.checkProfile();
  }

  private checkProfile() {
    this.profileService.currentUser().pipe(
      finalize(() => {
        this.doc.body.classList.remove("pending");
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


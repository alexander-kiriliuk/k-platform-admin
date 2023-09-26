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

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CardModule} from "primeng/card";
import {ImageModule} from "primeng/image";
import {createLoginForm} from "./auth.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Store} from "../modules/store/store";
import {AuthEvent} from "./auth.event";
import {provideTranslocoScope, TranslocoPipe} from "@ngneat/transloco";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {ToastEvent} from "../global/events";
import {ToastData} from "../global/types";

@Component({
  selector: "auth",
  standalone: true,
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    CardModule,
    ImageModule,
    ReactiveFormsModule,
    TranslocoPipe
  ],
  providers: [
    provideTranslocoScope("auth")
  ]
})
export class AuthComponent {

  readonly form = createLoginForm();
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);

  onSubmit() {
    const data = this.form.value;
    this.authService.login({
      login: data.login,
      password: data.password
    }).pipe(catchError((res) => {
      this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
      return throwError(res);
    })).subscribe(v => {
      this.store.emit(AuthEvent.Success, v);
    });
  }

}


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

import {Auth} from "@components/auth/auth.constants";
import {inject, Injectable, signal} from "@angular/core";
import {Store} from "@modules/store/store";
import {AuthService} from "@components/auth/auth.service";
import {CaptchaService} from "@global/service/captcha.service";
import {CaptchaResponse, ToastData} from "@global/types";
import {ThemeUtils} from "@global/util/theme.utils";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {finalize, throwError} from "rxjs";
import {LoginPayload} from "@components/auth/auth.types";
import {catchError} from "rxjs/operators";
import {ToastEvent} from "@global/events";
import {AuthEvent} from "@components/auth/auth.event";
import getCurrentTheme = ThemeUtils.getCurrentTheme;

@Injectable()
export class AuthViewModel {

  readonly reCaptchaResolved = signal<boolean>(undefined);
  readonly captchaConfig = signal<CaptchaResponse>(undefined);
  readonly form = Auth.createLoginForm();
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly captchaService = inject(CaptchaService);

  get preloaderChannel() {
    return Auth.PreloaderCn;
  }

  get theme() {
    return getCurrentTheme();
  }

  get isReCaptcha() {
    return this.captchaConfig().type === "google";
  }

  getCaptcha() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.captchaService.getCaptcha().pipe(
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel))
    ).subscribe(payload => {
      this.captchaConfig.set(payload);
      if (payload.enabled) {
        this.form.controls.captchaPayload.reset();
        this.form.controls.captchaId.setValue(payload.id);
      }
    });
  }

  doLogin() {
    this.authService.login(this.form.value as LoginPayload).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        if (this.isReCaptcha) {
          this.reCaptchaResolved.set(false);
          this.form.controls.captchaPayload.reset();
        } else {
          this.getCaptcha();
        }
        return throwError(res);
      })
    ).subscribe(v => {
      this.store.emit(AuthEvent.Success, v);
    });
  }

  onCaptchaResolved(payload: string) {
    this.form.controls.captchaPayload.setValue(payload);
    this.reCaptchaResolved.set(true);
  }

}

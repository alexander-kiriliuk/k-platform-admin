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

import {
ChangeDetectionStrategy,
ChangeDetectorRef,
Component,
inject,
OnInit,
ViewChild
} from "@angular/core";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CardModule} from "primeng/card";
import {ImageModule} from "primeng/image";
import {Auth} from "./auth.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Store} from "../modules/store/store";
import {AuthEvent} from "./auth.event";
import {TranslocoPipe} from "@ngneat/transloco";
import {catchError} from "rxjs/operators";
import {finalize, throwError} from "rxjs";
import {ToastEvent} from "../global/events";
import {CaptchaResponse, ToastData} from "../global/types";
import {CaptchaService} from "../global/service/captcha.service";
import {LoginPayload} from "./auth.types";
import {PreloaderComponent} from "../modules/preloader/preloader.component";
import {PreloaderDirective} from "../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../modules/preloader/preloader.event";
import {RecaptchaComponent, RecaptchaModule} from "ng-recaptcha";
import {ThemeUtils} from "../global/util/theme.utils";
import getCurrentTheme = ThemeUtils.getCurrentTheme;

@Component({
  selector: "auth",
  standalone: true,
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CaptchaService
  ],
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    CardModule,
    ImageModule,
    ReactiveFormsModule,
    TranslocoPipe,
    PreloaderComponent,
    PreloaderDirective,
    RecaptchaModule
  ]
})
export class AuthComponent implements OnInit {

  @ViewChild(RecaptchaComponent) recaptcha: RecaptchaComponent;
  readonly form = Auth.createLoginForm();
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly captchaService = inject(CaptchaService);
  private readonly cdr = inject(ChangeDetectorRef);

  reCaptchaResolved: boolean;
  captchaConfig: CaptchaResponse;

  get preloaderChannel() {
    return Auth.PreloaderCn;
  }

  get theme() {
    return getCurrentTheme();
  }

  get isReCaptcha() {
    return this.captchaConfig.type === "google";
  }

  ngOnInit(): void {
    this.getCaptcha();
  }

  getCaptcha() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.captchaService.getCaptcha().pipe(
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel))
    ).subscribe(payload => {
      this.captchaConfig = payload;
      if (payload.enabled) {
        this.form.controls.captchaPayload.reset();
        this.form.controls.captchaId.setValue(payload.id);
      }
      this.cdr.markForCheck();
    });
  }

  onCaptchaResolved(payload: string) {
    this.form.controls.captchaPayload.setValue(payload);
    this.reCaptchaResolved = true;
    this.cdr.markForCheck();
  }

  onSubmit() {
    const data = this.form.value;
    this.authService.login(data as LoginPayload).pipe(catchError((res) => {
      this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
      if (this.isReCaptcha) {
        this.reCaptchaResolved = false;
        this.form.controls.captchaPayload.reset();
        this.recaptcha.reset();
        this.cdr.markForCheck();
      } else {
        this.getCaptcha();
      }
      return throwError(res);
    })).subscribe(v => {
      this.store.emit(AuthEvent.Success, v);
    });
  }

}


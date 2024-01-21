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

import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {CurrentUser} from "../global/service/current-user";
import {ButtonModule} from "primeng/button";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {CreateProfileForm, Profile} from "./profile.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {InputSwitchModule} from "primeng/inputswitch";
import {CheckboxModule} from "primeng/checkbox";
import {ProfileService} from "./profile.service";
import {ToastData, User} from "../global/types";
import {LocalizePipe} from "../modules/locale/localize.pipe";
import {MediaInputComponent} from "../modules/media/input/media-input.component";
import {NgForOf, NgIf} from "@angular/common";
import {PreloaderComponent} from "../modules/preloader/preloader.component";
import {PreloaderDirective} from "../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../modules/preloader/preloader.event";
import {finalize, throwError} from "rxjs";
import {Store} from "../modules/store/store";
import {catchError} from "rxjs/operators";
import {ToastEvent} from "../global/events";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    LocalizePipe
  ],
  imports: [
    ButtonModule,
    TranslocoPipe,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    InputSwitchModule,
    CheckboxModule,
    LocalizePipe,
    MediaInputComponent,
    NgIf,
    NgForOf,
    PreloaderComponent,
    PreloaderDirective,
  ]
})
export class ProfileComponent implements OnInit {

  readonly currentUser = inject(CurrentUser);
  readonly form = CreateProfileForm();
  private readonly localizePipe = inject(LocalizePipe);
  private readonly ref = inject(DynamicDialogRef);
  private readonly profileService = inject(ProfileService);
  private readonly store = inject(Store);

  get roles() {
    const res: string[] = [];
    this.form.controls.roles.value.forEach(role => {
      res.push(this.localizePipe.transform(role.name, role.code) as string);
    });
    return res;
  }

  get preloaderChannel() {
    return Profile.PreloaderCn;
  }

  ngOnInit(): void {
    this.form.patchValue(this.currentUser.data);
  }

  save() {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.profileService.updateUser(this.form.value as User).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      })).subscribe(user => {
      this.ref.close(user);
    });
  }

}

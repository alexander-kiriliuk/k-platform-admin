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

import {inject, Injectable} from "@angular/core";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {ToastData, User} from "@global/types";
import {catchError} from "rxjs/operators";
import {ToastEvent} from "@global/events";
import {finalize, throwError} from "rxjs";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {ProfileService} from "@components/profile/profile.service";
import {Store} from "@modules/store/store";
import {CreateProfileForm, Profile} from "@components/profile/profile.constants";
import {CurrentUser} from "@global/service/current-user";


@Injectable()
export class ProfileViewModel {

  readonly form = CreateProfileForm();
  private readonly ref = inject(DynamicDialogRef);
  private readonly profileService = inject(ProfileService);
  private readonly store = inject(Store);
  private readonly currentUser = inject(CurrentUser);

  constructor() {
    this.form.patchValue(this.currentUser.data);
  }

  get preloaderChannel() {
    return Profile.PreloaderCn;
  }

  save() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.profileService.updateUser(this.form.value as User).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
      })).subscribe(user => {
      this.ref.close(user);
    });
  }

}

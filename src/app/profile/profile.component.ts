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
import {CreateProfileForm} from "./profile.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {MediaComponent} from "../modules/media/media.component";
import {InputSwitchModule} from "primeng/inputswitch";
import {CheckboxModule} from "primeng/checkbox";
import {ProfileService} from "./profile.service";
import {User} from "../global/types";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    TranslocoPipe,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    MediaComponent,
    InputSwitchModule,
    CheckboxModule,
  ]
})
export class ProfileComponent implements OnInit {

  readonly currentUser = inject(CurrentUser);
  readonly form = CreateProfileForm();
  private readonly ref = inject(DynamicDialogRef);
  private readonly profileService = inject(ProfileService);

  ngOnInit(): void {
    this.form.patchValue(this.currentUser.data);
  }

  save() {
    // TODO add animation
    this.profileService.updateUser(this.form.value as User).subscribe(v => {
      this.ref.close();
    });
  }

}

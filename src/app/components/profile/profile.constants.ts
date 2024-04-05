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

import {FormControl, FormGroup} from "@angular/forms";
import {UserRole} from "@global/types";
import {Media} from "@modules/media/media.types";
import {UserForm} from "./profile.types";

export function CreateProfileForm() {
  return new FormGroup<UserForm>({
    id: new FormControl<string>({disabled: true, value: null}),
    login: new FormControl<string>({disabled: true, value: null}),
    password: new FormControl<string>(null),
    phone: new FormControl<string>(null),
    email: new FormControl<string>(null),
    active: new FormControl<boolean>(null),
    avatar: new FormControl<Media>(null),
    firstName: new FormControl<string>(null),
    lastName: new FormControl<string>(null),
    roles: new FormControl<UserRole[]>(null),
  });
}

export namespace Profile {

  export const PreloaderCn = "profile-cn";

}

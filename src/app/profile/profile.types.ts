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

import {FormControl} from "@angular/forms";
import {Media} from "../modules/media/media.types";
import {LocalizedString} from "../modules/locale/locale.types";
import {UserRole} from "../global/types";

export interface UserForm {
  active: FormControl<boolean>,
  avatar: FormControl<Media>,
  email: FormControl<string>,
  firstName: FormControl<LocalizedString[]>,
  id: FormControl<string>,
  lastName: FormControl<LocalizedString[]>,
  login: FormControl<string>,
  password: FormControl<string>,
  phone: FormControl<string>,
  roles: FormControl<UserRole[]>,
  tsCreated: FormControl<Date>
}

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
import {ObjectForm} from "../object.types";
import {LocalizedString} from "../../modules/locale/locale.types";
import {Media} from "../../modules/media/media.types";

export namespace ObjectDetails {

  export const ObjectsDetailsPrCn = "objects-det-cn";

  export function createForm(): FormGroup<ObjectForm> {
    return new FormGroup<ObjectForm>({
      description: new FormControl<LocalizedString[]>(null),
      icon: new FormControl<Media>(null),
      name: new FormControl<LocalizedString[]>(null),
      tableName: new FormControl<string>(null),
      target: new FormControl<string>(null)
    });
  }

}

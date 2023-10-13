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

import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {ColumnForm, TargetForm} from "../object.types";
import {LocalizedString} from "../../modules/locale/locale.types";
import {Media} from "../../modules/media/media.types";
import {ExplorerColumn, ExplorerTarget} from "../../explorer/explorer.types";

export namespace ObjectDetails {

  export const ObjectsDetailsPrCn = "objects-det-cn";

  export function createTargetForm(): FormGroup<TargetForm> {
    return new FormGroup<TargetForm>({
      description: new FormControl<LocalizedString[]>(null),
      icon: new FormControl<Media>(null),
      name: new FormControl<LocalizedString[]>(null),
      tableName: new FormControl<string>(null),
      target: new FormControl<string>(null),
      columns: new FormArray<FormGroup<ColumnForm>>([])
    });
  }

  export function createColumnForm(payload: ExplorerColumn): FormGroup<ColumnForm> {
    return new FormGroup<ColumnForm>({
      description: new FormControl<LocalizedString[]>(payload.description),
      id: new FormControl<string>(payload.id),
      multiple: new FormControl<boolean>(payload.multiple),
      name: new FormControl<LocalizedString[]>(payload.name),
      primary: new FormControl<boolean>(payload.primary),
      property: new FormControl<string>(payload.property),
      referencedEntityName: new FormControl<string>(payload.referencedEntityName),
      referencedTableName: new FormControl<string>(payload.referencedTableName),
      target: new FormControl<ExplorerTarget>(payload.target),
      type: new FormControl<string>(payload.type),
      unique: new FormControl<boolean>(payload.unique),
      objectEnabled: new FormControl<boolean>(payload.objectEnabled),
      objectPriority: new FormControl<number>(payload.objectPriority),
      sectionEnabled: new FormControl<boolean>(payload.sectionEnabled),
      sectionPriority: new FormControl<number>(payload.sectionPriority),
    });
  }

}

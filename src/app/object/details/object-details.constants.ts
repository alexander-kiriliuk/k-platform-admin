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

import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ColumnForm, TargetForm} from "../object.types";
import {LocalizedString} from "../../modules/locale/locale.types";
import {Media} from "../../modules/media/media.types";
import {ExplorerColumn, ExplorerColumnRenderer} from "../../explorer/explorer.types";

export namespace ObjectDetails {

  export const PreloaderCn = "objects-det-cn";

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
      id: new FormControl<string>({value: payload.id, disabled: true}),
      property: new FormControl<string>({value: payload.property, disabled: true}),
      multiple: new FormControl<boolean>({value: payload.multiple, disabled: true}),
      primary: new FormControl<boolean>({value: payload.primary, disabled: true}),
      unique: new FormControl<boolean>({value: payload.unique, disabled: true}),
      referencedEntityName: new FormControl<string>({value: payload.referencedEntityName, disabled: true}),
      referencedTableName: new FormControl<string>({value: payload.referencedTableName, disabled: true}),
      virtual: new FormControl<boolean>({value: payload.virtual, disabled: true}),
      description: new FormControl<LocalizedString[]>(payload.description),
      name: new FormControl<LocalizedString[]>(payload.name),
      type: new FormControl<string>(payload.type),
      objectEnabled: new FormControl<boolean>(payload.objectEnabled),
      objectPriority: new FormControl<number>(payload.objectPriority),
      objectRenderer: new FormControl<ExplorerColumnRenderer>(payload.objectRenderer),
      sectionEnabled: new FormControl<boolean>(payload.sectionEnabled),
      sectionPriority: new FormControl<number>(payload.sectionPriority),
      sectionRenderer: new FormControl<ExplorerColumnRenderer>(payload.sectionRenderer),
    });
  }

}

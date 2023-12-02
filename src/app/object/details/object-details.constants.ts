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
import {ColumnForm, TabForm, TargetForm} from "../object.types";
import {LocalizedString} from "../../modules/locale/locale.types";
import {Media} from "../../modules/media/media.types";
import {
ExplorerColumn,
ExplorerColumnRenderer,
ExplorerTab,
ExplorerTarget
} from "../../explorer/explorer.types";
import {jsonStringValidator} from "../../global/validator/json-string.validator";
import {notOnlySpacesValidator} from "../../global/validator/not-only-spaces.validator";
import {
onlyLatinLettersAndNumbersValidator,
onlyLatinLettersAndNumbersWithHyphensValidator
} from "../../global/validator/only-latin-letters-and-numbers.validator";


function handleJsonColumn(data: unknown): object {
  if (data && typeof data === "object") {
    return JSON.stringify(data) as unknown as object;
  }
  return data as object;
}

export namespace ObjectDetails {

  export const PreloaderCn = "objects-det-cn";

  export function createTargetForm(): FormGroup<TargetForm> {
    return new FormGroup<TargetForm>({
      description: new FormControl<LocalizedString[]>(null),
      icon: new FormControl<Media>(null),
      name: new FormControl<LocalizedString[]>(null),
      tableName: new FormControl<string>(null),
      target: new FormControl<string>(null),
      alias: new FormControl<string>(null),
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
      sectionVisibility: new FormControl<boolean>(payload.sectionVisibility),
      objectPriority: new FormControl<number>(payload.objectPriority),
      objectRenderer: new FormControl<ExplorerColumnRenderer>(payload.objectRenderer),
      sectionEnabled: new FormControl<boolean>(payload.sectionEnabled),
      objectVisibility: new FormControl<boolean>(payload.objectVisibility),
      sectionPriority: new FormControl<number>(payload.sectionPriority),
      sectionRenderer: new FormControl<ExplorerColumnRenderer>(payload.sectionRenderer),
      sectionRendererParams: new FormControl<object>(
        handleJsonColumn(payload.sectionRendererParams), [jsonStringValidator()]
      ),
      objectRendererParams: new FormControl<object>(
        handleJsonColumn(payload.objectRendererParams), [jsonStringValidator()]
      ),
      tab: new FormControl<ExplorerTab>(payload.tab),
    });
  }

  export function createTabForm(target: ExplorerTarget): FormGroup<TabForm> {
    return new FormGroup<TabForm>({
      id: new FormControl<string>(null, [
        Validators.required,
        notOnlySpacesValidator(),
        onlyLatinLettersAndNumbersWithHyphensValidator()
      ]),
      name: new FormControl<LocalizedString[]>(null),
      priority: new FormControl<number>(0, [Validators.required]),
      size: new FormControl<object>(null, [jsonStringValidator()]),
      target: new FormControl<ExplorerTarget>(target),
    });
  }

}

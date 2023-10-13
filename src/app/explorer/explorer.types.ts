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


import {LocalizedString} from "../modules/locale/locale.types";
import {Media} from "../modules/media/media.types";
import {Params, QueryParamsHandling} from "@angular/router";

export type ColumnDataType = "string" | "number" | "boolean" | "date" | "reference" | "unknown";

export interface ExplorerTarget {
  target: string;
  tableName: string;
  name: LocalizedString[];
  description: LocalizedString[];
  icon: Media;
  columns: ExplorerColumn[];
  size?: number;
}

export interface ExplorerColumn {
  id: string;
  property: string;
  name: LocalizedString[];
  description: LocalizedString[];
  target: ExplorerTarget;
  primary: boolean;
  unique: boolean;
  type: ColumnDataType | string;
  multiple: boolean;
  referencedTableName: string;
  referencedEntityName: string;
}

export interface TargetData {
  primaryColumn: ExplorerColumn;
  entity: ExplorerTarget;
}

export interface SectionFilterDialogConfig {
  column: ExplorerColumn;
  paramsSnapshot: () => Params;
  navigate: (queryParams: Params, queryParamsHandling?: QueryParamsHandling) => void;
}

export interface SectionDialogConfig {
  target: TargetData;
  multi?: boolean;
}

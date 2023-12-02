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
import {PageableParams} from "../global/types";
import {Type, ValueProvider} from "@angular/core";

export type ColumnDataType = "string" | "number" | "boolean" | "date" | "reference" | "unknown";

export type RendererId = "string-section-renderer" | "boolean-section-renderer" | "date-section-renderer" |
  "media-section-renderer" | "reference-section-renderer" | string;

export interface ExplorerTarget {
  alias: string;
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
  type: ColumnDataType | string;
  primary: boolean;
  unique: boolean;
  multiple: boolean;
  referencedTableName: string;
  referencedEntityName: string;
  sectionPriority: number;
  objectPriority: number;
  sectionEnabled: boolean;
  objectEnabled: boolean;
  sectionVisibility: boolean;
  objectVisibility: boolean;
  virtual: boolean;
  sectionRenderer: ExplorerColumnRenderer;
  objectRenderer: ExplorerColumnRenderer;
  sectionRendererParams: object;
  objectRendererParams: object;
  tab: ExplorerTab;
}

export interface ExplorerTab {
  id: string;
  name: LocalizedString[];
  priority: number;
  size: object;
  target: ExplorerTarget;
}

export type ExplorerRendererType = "section" | "object";

export class ExplorerColumnRenderer {
  code: string;
  name: LocalizedString[];
  description: LocalizedString[];
  type: ExplorerRendererType;
  params: object;
}

export interface TargetData {
  primaryColumn: ExplorerColumn;
  namedColumn: ExplorerColumn;
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
  initialPageableParams?: PageableParams;
}

export interface ExplorerRenderer<Data = unknown, Params = unknown> {
  target: TargetData;
  column: ExplorerColumn;
  params: Params;
  data: { [k: string]: Data };
}

export type ExplorerRendererLoader = {
  code: RendererId;
  load: Promise<Type<ExplorerRenderer>>;
}

export interface RendererProvider extends ValueProvider{
  useValue: ExplorerRendererLoader;
}

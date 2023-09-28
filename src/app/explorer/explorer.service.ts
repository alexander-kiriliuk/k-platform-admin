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
import {HttpClient, HttpParams} from "@angular/common/http";
import {TargetData} from "./explorer.types";
import {StringUtils} from "../global/util/string.utils";
import {PageableData, PageableParams} from "../global/types";
import fillParams = StringUtils.fillParams;

@Injectable()
export class ExplorerService {

  private readonly http = inject(HttpClient);

  getTarget(target: string, type: "section" | "object") {
    return this.http.get<TargetData>(fillParams("/explorer/target/:target", target), {params: {type}});
  }

  getSectionList<T = unknown>(target: string, params: PageableParams) {
    return this.http.get<PageableData<T>>(fillParams("/explorer/pageable/:target", target), {
      params: params as unknown as HttpParams
    });
  }

  getEntity<T = unknown>(target: string, id: number) {
    return this.http.get<T>(fillParams("/explorer/entity/:target", target), {
      params: {
        id
      }
    });
  }

  removeEntity<T = unknown>(target: string, id: number) {
    return this.http.delete<T>(fillParams("/explorer/entity/:target/:id", target, id));
  }

  saveEntity<T = unknown>(entity: T, target: string, id?: number) {
    return this.http.post<T>(fillParams("/explorer/entity/:target", target), null, {
      params: {
        id
      }
    });
  }

}

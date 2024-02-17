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
import {HttpClient} from "@angular/common/http";
import {StringUtils} from "../util/string.utils";
import {Media} from "../../modules/media/media.types";
import fillParams = StringUtils.fillParams;

@Injectable()
export class MediaService {

  private readonly http = inject(HttpClient);

  reCreate(id: string) {
    return this.http.post<Media>(fillParams("/media/recreate/:id", id), undefined);
  }

  remove(id: string) {
    return this.http.delete<Media>(fillParams("/media/:id", id));
  }

}

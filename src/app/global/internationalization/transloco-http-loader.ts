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
import {Translation, TranslocoLoader} from "@ngneat/transloco";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class TranslocoHttpLoader implements TranslocoLoader {

  private readonly http = inject(HttpClient);

  getTranslation(lang: string) {
    const parts = lang.split("/");
    let path = parts[0];
    const res: string[] = [];
    if (parts.length > 1) {
      res.push(parts[0]);
      res.push("i18n");
      res.push(parts[parts.length - 1]);
      path = res.join("/");
    } else {
      path = `i18n/${parts[0]}`;
    }
    return this.http.get<Translation>(`/assets/${path}.json`);
  }

}

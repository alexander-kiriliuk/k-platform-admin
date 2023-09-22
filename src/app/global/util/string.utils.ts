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

export namespace StringUtils {

  export function fillParams(url: string, ...params: unknown[]) {
    let counter = -1;
    url.replace(/((:)(.*?))(\/|$)/g, (substring, args) => {
      counter++;
      url = url.replace(args, params[counter] as string ?? "");
      return url;
    });
    return url.replace(/\/+$/, "");
  }

  export function clearSpaces(str: string) {
    return str?.replace(/[^\S\r\n]{2,}/g, " ");
  }

}


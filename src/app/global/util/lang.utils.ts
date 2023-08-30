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

export namespace LangUtils {

  export const AvailableLangs = ["ru", "en"];
  export const DefaultLang = "en";

  const LANG_KEY = "lang_key";

  export function getCurrentLang() {
    const lang = localStorage.getItem(LANG_KEY);
    if (lang) {
      return lang;
    }
    return navigator.language.split("-")[0];
  }

  export function setLang(lang: string) {
    localStorage.setItem(LANG_KEY, lang);
  }

}


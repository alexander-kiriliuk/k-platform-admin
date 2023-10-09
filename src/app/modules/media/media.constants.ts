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

import {InjectionToken} from "@angular/core";

export const MEDIA_URL = new InjectionToken<string>("Url to media storage");
export const WEBP_SUPPORT = new InjectionToken<boolean>("WEBP media format support flag");

export enum ReservedMediaSize {
  THUMB = "thumb",
  ORIGINAL = "original"
}

export type MediaSize = "thumb" | "original" | string ;

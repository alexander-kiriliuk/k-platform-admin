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

import {inject, Pipe, PipeTransform} from "@angular/core";
import {Media} from "./media.types";
import {ReservedMediaFormat, WEBP_SUPPORT} from "./media.constants";
import {environment} from "@global/env/env";

@Pipe({
  name: "mediaUrl",
  standalone: true
})
export class MediaUrlPipe implements PipeTransform {

  private readonly webpSupport = inject(WEBP_SUPPORT);

  transform(media: Media, format: string = ReservedMediaFormat.THUMB) {
    if (!media) {
      return undefined;
    }
    const ext = this.webpSupport && media.type.vp6 ? "webp" : media.type.ext.code;
    if (ext === "svg") {
      format = ReservedMediaFormat.ORIGINAL;
    }
    const file = media.files?.find(v => v.format.code === format);
    const fileName = `${file?.name}.${ext}`;
    return `${environment.mediaUrl}/${media.id}/${fileName}`;
  }

}

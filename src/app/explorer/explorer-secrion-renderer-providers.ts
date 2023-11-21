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

import {EXPLORER_SECTION_RENDERER} from "./explorer.constants";
import {RendererProvider} from "./explorer.types";

export function provideExplorerSectionRenderers(): RendererProvider[] {
  return [
    {
      provide: EXPLORER_SECTION_RENDERER,
      multi: true,
      useValue: {
        code: "string-section-renderer",
        load: import("./renderer/default/section/string/string-section-renderer.component")
          .then(m => m.StringSectionRendererComponent)
      }
    },
    {
      provide: EXPLORER_SECTION_RENDERER,
      multi: true,
      useValue: {
        code: "boolean-section-renderer",
        load: import("./renderer/default/section/boolean/boolean-section-renderer.component")
          .then(m => m.BooleanSectionRendererComponent)
      }
    },
    {
      provide: EXPLORER_SECTION_RENDERER,
      multi: true,
      useValue: {
        code: "date-section-renderer",
        load: import("./renderer/default/section/date/date-section-renderer.component")
          .then(m => m.DateSectionRendererComponent)
      }
    },
    {
      provide: EXPLORER_SECTION_RENDERER,
      multi: true,
      useValue: {
        code: "reference-section-renderer",
        load: import("./renderer/default/section/reference/reference-section-renderer.component")
          .then(m => m.ReferenceSectionRendererComponent)
      }
    },
    {
      provide: EXPLORER_SECTION_RENDERER,
      multi: true,
      useValue: {
        code: "media-section-renderer",
        load: import("./renderer/default/section/media/media-section-renderer.component")
          .then(m => m.MediaSectionRendererComponent)
      }
    }
  ];
}

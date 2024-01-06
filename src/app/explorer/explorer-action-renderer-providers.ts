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

import {EXPLORER_ACTION_RENDERER} from "./explorer.constants";
import {ExplorerActionRendererProvider} from "./explorer.types";

export function provideExplorerActionRenderers(): ExplorerActionRendererProvider[] {
  return [
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "create-media-files-section-action",
        load: import("./renderer/custom/action/create-media/create-media-action-renderer.component")
          .then(m => m.CreateMediaActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "recreate-media-files-object-action",
        load: import("./renderer/custom/action/recreate-media/re-create-media-action-renderer.component")
          .then(m => m.ReCreateMediaActionRendererComponent)
      }
    },
  ];
}

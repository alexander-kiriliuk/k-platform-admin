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

import {ChangeDetectionStrategy, Component} from "@angular/core";
import {ExplorerColumn, ExplorerRenderer, TargetData} from "../../../../explorer.types";
import {Media} from "../../../../../modules/media/media.types";
import {MediaComponent} from "../../../../../modules/media/media.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: "media-section-renderer",
  standalone: true,
  templateUrl: "./media-section-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MediaComponent,
    NgForOf,
    NgIf,
  ],
})
export class MediaSectionRendererComponent implements ExplorerRenderer<Media | Media[]> {

  column: ExplorerColumn;
  params: unknown;
  data: { [p: string]: Media | Media[] };
  target: TargetData;

  get dataSet() {
    if (!this.column.multiple) {
      return [this.data[this.column.property]] as Media[];
    }
    return this.data[this.column.property] as Media[];
  }

}

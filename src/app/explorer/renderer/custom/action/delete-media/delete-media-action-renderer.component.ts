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
import {AbstractExplorerActionRenderer} from "../../../default/abstract-explorer-action-renderer";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {LocalizePipe} from "../../../../../modules/locale/localize.pipe";
import {NgIf} from "@angular/common";

@Component({
  selector: "delete-media-action-renderer",
  standalone: true,
  templateUrl: "./delete-media-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    NgIf
  ],
})
export class DeleteMediaActionRendererComponent extends AbstractExplorerActionRenderer {

  deleteMedia() {
    // todo
    alert("todo deleteMedia");
  }

}

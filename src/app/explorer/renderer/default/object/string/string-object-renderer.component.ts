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

import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";
import {NumberUtils} from "../../../../../global/util/number.utils";
import {LocalizePipe} from "../../../../../modules/locale/localize.pipe";

@Component({
  selector: "string-object-renderer",
  standalone: true,
  templateUrl: "./string-object-renderer.component.html",
  styleUrls: ["./string-object-renderer.component.scss"],
  imports: [
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    LocalizePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringObjectRendererComponent extends AbstractExplorerObjectRenderer implements OnInit {

  readonly id = NumberUtils.getRandomInt();

  ngOnInit(): void {
    if (this.column.primary) {
      this.ctrl.disable();
    }
  }

}

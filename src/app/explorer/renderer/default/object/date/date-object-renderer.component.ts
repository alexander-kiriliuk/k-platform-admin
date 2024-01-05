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
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";
import {DatePipe} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {LocalizePipe} from "../../../../../modules/locale/localize.pipe";
import {DateObjectRendererParams} from "./date-object-renderer.types";
import {NumberUtils} from "../../../../../global/util/number.utils";

@Component({
  selector: "date-object-renderer",
  standalone: true,
  templateUrl: "./date-object-renderer.component.html",
  styleUrls: ["./date-object-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    CalendarModule,
    PaginatorModule,
    ReactiveFormsModule,
    LocalizePipe
  ]
})
export class DateObjectRendererComponent extends AbstractExplorerObjectRenderer<string, DateObjectRendererParams>
  implements OnInit {

  readonly id = NumberUtils.getRandomInt().toString();
  rendererParams: DateObjectRendererParams = {
    dateFormat: "medium",
    firstDayOfWeek: 1,
    showTime: false,
    showSeconds: false,
    readonlyInput: true,
    inline: true
  };

  get currentDate(){
    return new Date();
  }

  ngOnInit(): void {
    this.ctrl.setValue(this.ctrl.value ? new Date(this.ctrl.value) : this.currentDate);
    if (this.params) {
      Object.assign(this.rendererParams, this.params);
    }
  }

}

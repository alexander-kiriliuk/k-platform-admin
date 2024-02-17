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

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {
  AbstractExplorerActionRenderer
} from "../../../../default/abstract-explorer-action-renderer";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {LocalizePipe} from "../../../../../../modules/locale/localize.pipe";
import {ProcessService} from "../../../../../../global/service/process.service";
import {TranslocoPipe} from "@ngneat/transloco";
import {ProcessUnit} from "../../../../../../global/types";

@Component({
  selector: "stop-process-action-renderer",
  standalone: true,
  templateUrl: "./stop-process-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProcessService],
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    TranslocoPipe
  ],
})
export class StopProcessActionRendererComponent extends AbstractExplorerActionRenderer<ProcessUnit> {

  private readonly service = inject(ProcessService);

  stop() {
    this.service.stop((this.data as ProcessUnit).code)
      .subscribe(() => {

      });
  }

}

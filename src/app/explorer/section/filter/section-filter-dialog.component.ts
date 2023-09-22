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
import {CommonModule} from "@angular/common";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerColumn} from "../../explorer.types";

@Component({
  selector: "section-filter-dialog",
  standalone: true,
  templateUrl: "./section-filter-dialog.component.html",
  styleUrls: ["./section-filter-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class SectionFilterDialogComponent {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);


  get data() {
    return this.config.data as ExplorerColumn;
  }

}

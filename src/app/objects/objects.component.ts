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

import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {DashboardEvent} from "../dashboard/dashboard.event";
import {TranslocoService} from "@ngneat/transloco";
import {Store} from "../modules/store/store";
import {ExplorerService} from "../explorer/explorer.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {finalize, tap} from "rxjs";
import {CardModule} from "primeng/card";
import {LocalizePipe} from "../modules/locale/localize.pipe";
import {MediaComponent} from "../modules/media/media.component";

@Component({
  selector: "objects",
  standalone: true,
  templateUrl: "./objects.component.html",
  styleUrls: ["./objects.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    AsyncPipe,
    CardModule,
    NgIf,
    LocalizePipe,
    MediaComponent
  ],
  providers: [
    ExplorerService
  ]
})
export class ObjectsComponent implements AfterViewInit {

  private readonly store = inject(Store);
  private readonly ts = inject(TranslocoService);
  private readonly explorerService = inject(ExplorerService);
  readonly targetList$ = this.explorerService.getTargetList().pipe(
    tap(() => {
      console.log("start-of-load");
    }),
    finalize(() => {
      console.log("fin-of-load");
    })
  );

  constructor() {
    this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("object.title"));
  }

  ngAfterViewInit(): void {
  }

}

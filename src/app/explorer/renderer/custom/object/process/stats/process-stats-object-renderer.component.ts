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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {LocalizePipe} from "../../../../../../modules/locale/localize.pipe";
import {
AbstractExplorerObjectRenderer
} from "../../../../default/abstract-explorer-object-renderer";
import {ProcessService} from "../../../../../../global/service/process.service";
import {ProcessLog, ProcessStatus, ProcessUnit} from "../../../../../../global/types";
import {ExplorerObjectRendererComponent} from "../../../../explorer-object-renderer.component";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {TabViewModule} from "primeng/tabview";
import {TranslocoPipe} from "@ngneat/transloco";
import {ProcessLogPipe} from "../../../../../../modules/process/process-log.pipe";
import {ButtonModule} from "primeng/button";
import {Subscription} from "rxjs";
import {ExplorerEvent} from "../../../../../object/explorer.event";
import {Store} from "../../../../../../modules/store/store";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "process-stats-media-object-renderer",
  standalone: true,
  templateUrl: "./process-stats-object-renderer.component.html",
  styleUrls: ["./process-stats-object-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizePipe,
    ExplorerObjectRendererComponent,
    NgForOf,
    NgIf,
    TabViewModule,
    TranslocoPipe,
    DatePipe,
    ProcessLogPipe,
    ButtonModule,
    NgClass,
  ],
  providers: [
    ProcessService
  ]
})
export class ProcessStatsObjectRendererComponent extends AbstractExplorerObjectRenderer<ProcessUnit>
  implements OnInit {

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly service = inject(ProcessService);
  private readonly store = inject(Store);
  private logsSub: Subscription;
  private statsSub: Subscription;
  private lastStatusValue: ProcessStatus;
  activeTabIndex = 0;
  logsList: ProcessLog[] = [];

  get processData() {
    return this.data as ProcessUnit;
  }

  get statusControlValue() {
    return this.entityForm.controls.status.value as ProcessStatus;
  }

  ngOnInit(): void {
    if (!this.data.enabled) {
      this.getStats();
    } else {
      this.subscribeToPoller();
    }
  }

  private getStats() {
    this.service.stats(this.processData.code)
      .subscribe(payload => {
        this.onStatsReceived(payload);
      });
  }

  private subscribeToPoller() {
    this.statsSub = this.service.statsPolling(this.processData.code)
      .pipe(untilDestroyed(this))
      .subscribe(payload => {
        this.onStatsReceived(payload);
      });
  }

  private onStatsReceived(payload: ProcessUnit) {
    this.logsList = payload.logs;
    this.cdr.markForCheck();
    if (!this.lastStatusValue && payload.status === "execute") {
      this.statsSub.unsubscribe();
      this.subscribeToActiveLog();
      return;
    }
    const statusWasChanged = this.lastStatusValue && this.lastStatusValue !== payload.status;
    this.lastStatusValue = payload.status;
    if (statusWasChanged) {
      this.entityForm.controls.status.setValue(payload.status);
      this.entityForm.controls.enabled.setValue(payload.enabled);
      this.statsSub.unsubscribe();
      this.subscribeToActiveLog();
    }
  }

  private subscribeToActiveLog() {
    if (!this.logsList.length) {
      return;
    }
    this.logsSub = this.service.logsPolling(this.logsList[0].id)
      .pipe(untilDestroyed(this))
      .subscribe(v => {
        if (!v?.content) {
          this.logsSub?.unsubscribe();
          this.store.emit(ExplorerEvent.ReloadObject);
          return;
        }
        const founded = this.logsList.find(v => v.id === v.id);
        if (!founded?.content) {
          return;
        }
        founded.content = v.content;
        this.cdr.markForCheck();
      });
  }

}

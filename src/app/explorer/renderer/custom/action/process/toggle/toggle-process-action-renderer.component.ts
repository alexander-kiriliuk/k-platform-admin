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
import {
AbstractExplorerActionRenderer
} from "../../../../default/abstract-explorer-action-renderer";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {ProcessService} from "../../../../../../global/service/process.service";
import {TranslocoPipe} from "@ngneat/transloco";
import {ProcessStatus, ProcessUnit, ToastData} from "../../../../../../global/types";
import {NgClass} from "@angular/common";
import {ExplorerObjectDto} from "../../../../../explorer.types";
import {ExplorerEvent} from "../../../../../object/explorer.event";
import {Store} from "../../../../../../modules/store/store";
import {catchError} from "rxjs/operators";
import {ToastEvent} from "../../../../../../global/events";
import {finalize, throwError} from "rxjs";
import {Explorer} from "../../../../../explorer.constants";
import {PreloaderEvent} from "../../../../../../modules/preloader/preloader.event";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "toggle-process-action-renderer",
  standalone: true,
  templateUrl: "./toggle-process-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProcessService],
  imports: [
    RippleModule,
    ButtonModule,
    TranslocoPipe,
    NgClass
  ],
})
export class ToggleProcessActionRendererComponent extends AbstractExplorerActionRenderer<ProcessUnit>
  implements OnInit {

  private readonly service = inject(ProcessService);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);

  get enabledCtrlValue() {
    return this.entityForm.controls.enabled.value as boolean;
  }

  get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  ngOnInit() {
    this.entityForm.controls.enabled.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  toggle() {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.service.toggle((this.data as ProcessUnit).code).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      }),
    ).subscribe(() => {
      this.store.emit(ExplorerEvent.ReloadObject);
    });
  }

}

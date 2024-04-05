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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  OnInit,
  runInInjectionContext
} from "@angular/core";
import {
AbstractExplorerActionRenderer
} from "@components/explorer/renderer/default/abstract-explorer-action-renderer";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {ProcessService} from "@global/service/process.service";
import {TranslocoPipe} from "@ngneat/transloco";
import {ProcessStatus, ProcessUnit, ToastData} from "@global/types";
import {ExplorerEvent} from "@components/explorer/object/explorer.event";
import {Store} from "@modules/store/store";
import {catchError} from "rxjs/operators";
import {ToastEvent} from "@global/events";
import {finalize, throwError} from "rxjs";
import {Explorer} from "@components/explorer/explorer.constants";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: "start-process-action-renderer",
  standalone: true,
  templateUrl: "./start-process-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProcessService],
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    TranslocoPipe
  ],
})
export class StartProcessActionRendererComponent extends AbstractExplorerActionRenderer
  implements OnInit {

  private readonly service = inject(ProcessService);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  get enabledCtrlValue() {
    return this.entityForm().controls.enabled.value as boolean;
  }

  get statusControlValue() {
    return this.entityForm().controls.status.value as ProcessStatus;
  }

  get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.entityForm().controls.status.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          this.cdr.markForCheck();
        });
    });
  }

  start() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.service.start((this.data() as ProcessUnit).code).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
      }),
    ).subscribe(() => {
      this.store.emit(ExplorerEvent.ReloadObject);
    });
  }

}

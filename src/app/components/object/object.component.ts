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
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {Store} from "@modules/store/store";
import {ExplorerService} from "@components/explorer/explorer.service";
import {AsyncPipe} from "@angular/common";
import {debounceTime, distinctUntilChanged, finalize, of, startWith, switchMap, tap} from "rxjs";
import {CardModule} from "primeng/card";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {MediaComponent} from "@modules/media/media.component";
import {BadgeModule} from "primeng/badge";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {PreloaderComponent} from "@modules/preloader/preloader.component";
import {PreloaderDirective} from "@modules/preloader/preloader.directive";
import {Object} from "./object.constants";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {map} from "rxjs/operators";
import {ExplorerTarget} from "@components/explorer/explorer.types";
import {DialogService} from "primeng/dynamicdialog";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DashboardEvent} from "@global/events";

@Component({
  selector: "object",
  standalone: true,
  templateUrl: "./object.component.html",
  styleUrls: ["./object.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CardModule,
    LocalizePipe,
    MediaComponent,
    BadgeModule,
    InputTextModule,
    ReactiveFormsModule,
    TranslocoPipe,
    PreloaderComponent,
    PreloaderDirective
  ],
  providers: [
    ExplorerService
  ]
})
export class ObjectComponent {

  private readonly store = inject(Store);
  private readonly ts = inject(TranslocoService);
  private readonly explorerService = inject(ExplorerService);
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  readonly ctrl: FormControl<string> = new FormControl();
  private targetsCache: ExplorerTarget[] = [];

  readonly targetList$ = this.ctrl.valueChanges.pipe(
    startWith(""),
    map(value => value.trim().toLowerCase()),
    debounceTime(300),
    distinctUntilChanged(),
    takeUntilDestroyed(),
    switchMap(filterValue => {
      if (this.targetsCache.length === 0) {
        return this.explorerService.getTargetList().pipe(
          tap(targets => {
            this.targetsCache = targets;
            this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
          }),
          finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel)),
          map(targetList => this.findTarget(targetList, filterValue))
        );
      } else {
        return of(this.findTarget(this.targetsCache, filterValue));
      }
    })
  );

  get preloaderChannel() {
    return Object.PreloaderCn;
  }

  constructor() {
    this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("object.title"));
  }

  showObjectDetails(item: ExplorerTarget) {
    import("./details/object-details.component").then(c => {
      this.dialogService.open(c.ObjectDetailsComponent, {
        header: this.localizePipe.transform(item.name, item.target).toString(),
        data: item.target,
        resizable: true,
        draggable: true,
        modal: true,
        position: "center"
      });
    });
  }

  private findTarget(targetList: ExplorerTarget[], val: string) {
    if (!val) {
      return targetList;
    }
    return targetList.filter(et => {
      if (et.tableName.toLowerCase().indexOf(val) !== -1 || et.target.toLowerCase().indexOf(val) !== -1) {
        return true;
      }
      if (!et?.name) {
        return false;
      }
      for (const ls of et.name) {
        if (ls.value.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

}

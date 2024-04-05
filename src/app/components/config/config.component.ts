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
import {Config} from "./config.constants";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {Store} from "@modules/store/store";
import {ConfigService} from "./config.service";
import {ButtonModule} from "primeng/button";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {PreloaderComponent} from "@modules/preloader/preloader.component";
import {PreloaderDirective} from "@modules/preloader/preloader.directive";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule, TablePageEvent} from "primeng/table";
import {ConfigItem, ConfigPropertyEditorResult} from "./config.types";
import {PageableData, PageableParams, ToastData} from "@global/types";
import {debounceTime, distinctUntilChanged, finalize, throwError} from "rxjs";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {DialogService} from "primeng/dynamicdialog";
import {catchError} from "rxjs/operators";
import {DashboardEvent, ToastEvent} from "@global/events";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: "config",
  standalone: true,
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigService],
  imports: [
    ButtonModule,
    LocalizePipe,
    PreloaderComponent,
    PreloaderDirective,
    RippleModule,
    SharedModule,
    TableModule,
    TranslocoPipe,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule
  ]
})
export class ConfigComponent implements OnInit {

  private readonly ts = inject(TranslocoService);
  private readonly store = inject(Store);
  private readonly configService = inject(ConfigService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogService = inject(DialogService);
  private readonly injector = inject(Injector);
  data: PageableData<ConfigItem>;
  searchCtrl: FormControl<string> = new FormControl();

  get scrollHeight() {
    return "calc(100vh - var(--header-bar-h) - var(--paginator-h))";
  }

  get preloaderChannel() {
    return Config.PreloaderCn;
  }

  get currentPos() {
    return ((this.data?.currentPage ?? 1) - 1) * (this.data?.pageSize ?? 0);
  }

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      this.searchCtrl.valueChanges.pipe(
        takeUntilDestroyed(),
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe(() => {
        this.getData();
      });
      this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("config.title"));
      this.getData();
    });
  }

  getData(e?: TablePageEvent) {
    const params = {} as PageableParams;
    if (this.searchCtrl.value) {
      params.filter = this.searchCtrl.value;
    }
    if (e) {
      params.page = e.first / e.rows + 1;
      params.limit = e.rows;
    }
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.configService.pageableData(params).pipe(
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
      })).subscribe(payload => {
      this.data = payload;
      this.cdr.markForCheck();
    });
  }

  openPropertyEditor(item?: ConfigItem) {
    import("./editor/config-property-editor.component").then(c => {
      this.dialogService.open(c.ConfigPropertyEditorComponent, {
        header: this.ts.translate("config.header"),
        resizable: false,
        draggable: false,
        modal: true,
        position: "center",
        data: item
      }).onClose.subscribe((res: ConfigPropertyEditorResult) => {
        if (!res) {
          return;
        }
        switch (res.cmd) {
          case "delete":
            this.deleteProperty(res.data);
            break;
          case "save":
            this.saveProperty(res.data);
            break;
        }
      });
    });
  }

  private deleteProperty(data: ConfigItem) {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.configService.removeProperty(data.key).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel)))
      .subscribe(() => {
        const idx = this.data.items.findIndex(v => v.key === data.key);
        this.data.items.splice(idx, 1);
        this.cdr.markForCheck();
        this.store.emit<ToastData>(ToastEvent.Success, {message: this.ts.translate("config.property.deleted")});
      });
  }

  private saveProperty(data: ConfigItem) {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.configService.setProperty(data).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel)))
      .subscribe(() => {
        const idx = this.data.items.findIndex(v => v.key === data.key);
        if (idx !== -1) {
          this.data.items.splice(idx, 1);
        }
        this.data.items.unshift(data);
        this.cdr.markForCheck();
        this.store.emit<ToastData>(ToastEvent.Success, {message: this.ts.translate("config.property.saved")});
      });
  }

}

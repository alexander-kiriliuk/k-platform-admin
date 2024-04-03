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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  inject,
  Injector,
  runInInjectionContext
} from "@angular/core";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {ExplorerService} from "../explorer.service";
import {BehaviorSubject, finalize, skip, Subscription, throwError} from "rxjs";
import {Explorer} from "../explorer.constants";
import {Store} from "../../modules/store/store";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {ActivatedRoute, Params, QueryParamsHandling, Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {PageableData, PageableParams, PlainObject, ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";
import {TableModule, TablePageEvent} from "primeng/table";
import {
ExplorerColumn,
ObjectDialogConfig,
SectionDialogConfig,
TargetData
} from "../explorer.types";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {RippleModule} from "primeng/ripple";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {StringUtils} from "../../global/util/string.utils";
import {NgClass} from "@angular/common";
import {DashboardEvent} from "../../dashboard/dashboard.event";
import {ButtonModule} from "primeng/button";
import {ExplorerSectionRendererComponent} from "../renderer/explorer-section-renderer.component";
import {ExplorerActionRendererComponent} from "../renderer/explorer-action-renderer.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import parseParamsString = StringUtils.parseParamsString;
import stringifyParamsObject = StringUtils.stringifyParamsObject;

@Component({
  selector: "section",
  standalone: true,
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreloaderComponent,
    PreloaderDirective,
    TableModule,
    LocalizePipe,
    RippleModule,
    NgClass,
    TranslocoPipe,
    ButtonModule,
    ExplorerSectionRendererComponent,
    ExplorerActionRendererComponent,
  ],
  providers: [
    ExplorerService
  ]
})
export class SectionComponent implements AfterViewInit {

  targetData: TargetData;
  pageableData: PageableData;
  readonly selectedRows: { [pk: string | number]: unknown } = {};
  private readonly dialogRef = inject(DynamicDialogRef, {optional: true});
  private readonly config = inject(DynamicDialogConfig, {optional: true});
  private readonly explorerService = inject(ExplorerService);
  private readonly store = inject(Store);
  private readonly ar = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly ts = inject(TranslocoService);
  private readonly injector = inject(Injector);
  private target: string;
  private sectionSub: Subscription;
  private paramsSub = new BehaviorSubject<Params>({});

  @HostBinding("class.dialogMode")
  get cssClass() {
    return this.dialogMode;
  }

  get selectedRowsCount() {
    return Object.keys(this.selectedRows).length;
  }

  get preloaderChannel() {
    return Explorer.SectionPreloaderCn;
  }

  get currentPos() {
    return ((this.pageableData?.currentPage ?? 1) - 1) * (this.pageableData?.pageSize ?? 0);
  }

  get data() {
    return this.config?.data as SectionDialogConfig;
  }

  get multiselect() {
    return this.data?.multi;
  }

  get dialogMode() {
    return !!this.dialogRef;
  }

  get queryParams$() {
    return this.dialogMode ? this.paramsSub.asObservable() : this.ar.queryParams;
  }

  get queryParamsSnapshot(): Params {
    return this.dialogMode ? this.paramsSub.value : this.ar.snapshot.queryParams;
  }

  get scrollHeight() {
    return this.dialogMode ? undefined : "calc(100vh - var(--header-bar-h) - var(--paginator-h))";
  }

  constructor() {
    if (this.data?.target) {
      this.targetData = this.data.target;
      this.target = this.targetData.entity.target;
    }
  }

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      if (!this.dialogMode) {
        this.ar.params.pipe(takeUntilDestroyed()).subscribe(v => {
          this.target = v.target;
          this.getTarget();
        });
      } else {
        this.getSection(this.data?.initialPageableParams);
      }
      this.queryParams$.pipe(skip(1), takeUntilDestroyed()).subscribe(v => {
        this.getSection(v as PageableParams);
      });
    });
  }

  getItems(e: TablePageEvent) {
    const params = {} as PageableParams;
    Object.assign(params, this.queryParamsSnapshot);
    params.page = e.first / e.rows + 1;
    params.limit = e.rows;
    this.doNavigate(params, Object.keys(params).length ? "merge" : undefined);
  }

  propertyFilter(propName: string) {
    const filterObject = this.getParsedFilter();
    if (!filterObject || !filterObject[propName]) {
      return undefined;
    }
    return filterObject[propName];
  }

  showFilterDialog(column: ExplorerColumn) {
    import("./filter/section-filter-dialog.component").then(c => {
      this.dialogService.open(c.SectionFilterDialogComponent, {
        header: this.ts.translate("explorer.filter.head", {
          v: this.localizePipe.transform(column.name, column.property)
        }),
        resizable: false,
        draggable: false,
        modal: true,
        position: "top",
        data: {
          column,
          paramsSnapshot: () => this.queryParamsSnapshot,
          navigate: (queryParams: Params, queryParamsHandling?: QueryParamsHandling) => {
            this.doNavigate(queryParams, queryParamsHandling);
          }
        }
      });
    });
  }

  removeSorting() {
    const queryParams = {...this.queryParamsSnapshot};
    delete queryParams.sort;
    delete queryParams.order;
    queryParams.page = 1;
    this.doNavigate(queryParams);
  }

  removeFilter(property: string) {
    const queryParams = {...this.queryParamsSnapshot};
    queryParams.page = 1;
    const filter = parseParamsString(queryParams.filter);
    delete filter[property];
    if (Object.keys(filter).length) {
      queryParams.filter = stringifyParamsObject(filter);
    } else {
      delete queryParams.filter;
    }
    this.doNavigate(queryParams);
  }

  selectEntityAndCloseDialog(item: PlainObject) {
    if (!this.multiselect) {
      this.dialogRef.close(item);
      return;
    }
    const pk = item[this.targetData.primaryColumn.property] as string;
    if (this.selectedRows[pk]) {
      delete this.selectedRows[pk];
    } else {
      this.selectedRows[pk] = item;
    }
    this.cdr.markForCheck();
  }

  applySelectedRows() {
    const res: unknown[] = [];
    for (const key in this.selectedRows) {
      res.push(this.selectedRows[key]);
    }
    this.dialogRef.close(res);
  }

  isSelected(item: PlainObject) {
    if (!this.multiselect) {
      return false;
    }
    const pk = item[this.targetData.primaryColumn.property] as string;
    return this.selectedRows[pk] !== undefined;
  }

  openObjectUi(item: { [pk: string | number]: unknown }) {
    const entity = this.targetData.entity;
    const id = item[this.targetData.primaryColumn.property];
    const title = this.localizePipe.transform(entity.name, entity.target) as string;
    if (this.dialogMode) {
      import("../../explorer/object/explorer-object.component").then(m => {
        this.dialogService.open(m.ExplorerObjectComponent, {
          header: title + ` #${id}`,
          data: {target: this.target, id} as ObjectDialogConfig,
          modal: true,
          position: "top",
          maximizable: true,
          width: "100vw",
        });
      });
      return;
    }
    this.router.navigate([
      `/object/${entity.alias || entity.target}/${id}`
    ]);
  }

  navToCreateNewItemUi() {
    const entity = this.targetData.entity;
    this.router.navigate([
      `/object/${entity.alias || entity.target}/${Explorer.NewItemToken}`
    ]);
  }

  private getSection(params?: PageableParams) {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.sectionSub?.unsubscribe();
    this.sectionSub = this.explorerService.getSectionList(this.target, params).pipe(
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
        if (this.dialogMode) {
          return;
        }
        this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("explorer.title", {
          count: this.pageableData.totalCount,
          name: this.localizePipe.transform(this.targetData.entity.name, this.targetData.entity.target)
        }));
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(v => {
      this.pageableData = v;
      this.cdr.markForCheck();
    });
  }

  private getTarget() {
    this.explorerService.getTarget(this.target, "section").pipe(
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(v => {
      this.targetData = v;
      this.getSection(this.queryParamsSnapshot as PageableParams);
    });
  }

  private getParsedFilter() {
    const filter = this.queryParamsSnapshot.filter;
    if (!filter) {
      return undefined;
    }
    return parseParamsString(filter);
  }

  private doNavigate(queryParams: Params, queryParamsHandling?: QueryParamsHandling) {
    if (this.dialogMode) {
      this.paramsSub.next(queryParams);
    } else {
      this.router.navigate([], {queryParams, queryParamsHandling});
    }
  }

}

import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {ExplorerService} from "../explorer.service";
import {finalize, skip, throwError} from "rxjs";
import {Explorer} from "../explorer.constants";
import {Store} from "../../modules/store/store";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {PageableData, PageableParams, ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TableModule, TablePageEvent} from "primeng/table";
import {ExplorerColumn, TargetData} from "../explorer.types";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {RippleModule} from "primeng/ripple";
import {DialogService} from "primeng/dynamicdialog";
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";


@UntilDestroy()
@Component({
  selector: "section",
  standalone: true,
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PreloaderComponent,
    PreloaderDirective,
    TableModule,
    LocalizePipe,
    RippleModule
  ],
  providers: [
    ExplorerService,
    provideTranslocoScope({scope: "section"}),
  ]
})
export class SectionComponent implements AfterViewInit {

  targetData: TargetData;
  pageableData: PageableData;
  private readonly sectionService = inject(ExplorerService);
  private readonly store = inject(Store);
  private readonly ar = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogService = inject(DialogService);
  private readonly ts = inject(TranslocoService);
  private target: string;

  get preloaderChannel() {
    return Explorer.SectionPrCn;
  }

  get currentPos() {
    return ((this.pageableData?.currentPage ?? 1) - 1) * (this.pageableData?.pageSize ?? 0);
  }

  ngAfterViewInit(): void {
    this.ar.params.pipe(untilDestroyed(this)).subscribe(v => {
      this.target = v["target"];
      this.getTarget();
    });
    this.ar.queryParams.pipe(skip(1), untilDestroyed(this)).subscribe(v => {
      this.getSection(v as PageableParams);
    });
  }

  getItems(e: TablePageEvent) {
    const params = {} as PageableParams;
    Object.assign(params, this.ar.snapshot.queryParams);
    params.page = e.first / e.rows + 1;
    params.limit = e.rows;
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: Object.keys(params).length ? "merge" : undefined
    });
  }

  showFilterDialog(item: ExplorerColumn) {
    import("./filter/section-filter-dialog.component").then(c => {
      this.dialogService.open(c.SectionFilterDialogComponent, {
        header: this.ts.translate("section.filter.head", {v: item.property}),
        resizable: false,
        draggable: false,
        modal: true,
        data: item
      });
    });
  }

  private getSection(params?: PageableParams) {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.sectionService.getSectionList(this.target, params).pipe(
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
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
    this.sectionService.getTarget(this.target).pipe(
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(v => {
      this.targetData = v;
      this.getSection(this.ar.snapshot.queryParams as PageableParams);
    });
  }

}

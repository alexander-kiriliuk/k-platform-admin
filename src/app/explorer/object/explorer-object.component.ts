import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ExplorerService} from "../explorer.service";
import {finalize, forkJoin, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";
import {Store} from "../../modules/store/store";
import {DashboardEvent} from "../../dashboard/dashboard.event";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {
ExplorerObjectDto,
ExplorerTab,
ExplorerTabSize,
ObjectDialogConfig,
TargetData
} from "../explorer.types";
import {ExplorerObjectRendererComponent} from "../renderer/explorer-object-renderer.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl} from "@angular/forms";
import {TabViewModule} from "primeng/tabview";
import {ExplorerObject} from "./explorer-object.constants";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {DEVICE} from "../../modules/device/device.constants";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ExplorerEvent} from "./explorer.event";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Explorer} from "../explorer.constants";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {StoreMessage} from "../../modules/store/store-message";

@UntilDestroy()
@Component({
  selector: "explorer-object",
  standalone: true,
  templateUrl: "./explorer-object.component.html",
  styleUrls: ["./explorer-object.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExplorerService,
    LocalizePipe
  ],
  imports: [
    ExplorerObjectRendererComponent,
    NgForOf,
    NgIf,
    TabViewModule,
    TranslocoPipe,
    NgClass,
    ButtonModule,
    RippleModule,
    PreloaderComponent,
    PreloaderDirective
  ],
})
export class ExplorerObjectComponent implements OnInit {

  private readonly dialogRef = inject(DynamicDialogRef, {optional: true});
  private readonly config = inject(DynamicDialogConfig, {optional: true});
  private readonly ar = inject(ActivatedRoute);
  private readonly explorerService = inject(ExplorerService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly device = inject(DEVICE);
  private readonly ts = inject(TranslocoService);
  readonly entityForm = this.fb.group({});
  readonly restTab = ExplorerObject.RestTab;
  targetData: TargetData;
  entityData: { [k: string]: unknown };
  tabs: ExplorerTab[] = [];
  activeTabIndex = 0;

  constructor() {
    this.store.on<ExplorerObjectDto>(ExplorerEvent.SaveObject).pipe(untilDestroyed(this))
      .subscribe(data => this.handleSaveEvent(data));
    this.store.on<ExplorerObjectDto>(ExplorerEvent.DeleteObject).pipe(untilDestroyed(this))
      .subscribe(data => this.handleDeleteEvent(data));
  }

  private get data() {
    return this.config?.data as ObjectDialogConfig;
  }

  get dialogMode() {
    return !!this.dialogRef;
  }

  get id() {
    return this.dialogMode ? this.data.id : this.ar.snapshot.params.id;
  }

  get target() {
    return this.dialogMode ? this.data.target : this.ar.snapshot.params.target;
  }

  get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  get canDeleteObject() {
    if (!this.entityData) {
      return false;
    }
    return this.entityData[this.targetData?.primaryColumn?.property];
  }

  get tabClassName() {
    const tabSize = this.tabs[this.activeTabIndex]?.size;
    if (!tabSize) {
      return null;
    }
    const key: keyof ExplorerTabSize = this.device.isDesktop ? "desktop" : this.device.isTablet ? "tablet" : null;
    if (!key) {
      return null;
    }
    return `col-${tabSize[key]}`;
  }

  ngOnInit(): void {
    const targetObs = this.explorerService.getTarget(this.target, "object");
    const entityObs = this.explorerService.getEntity<{ [k: string]: unknown }>(this.target, this.id);
    forkJoin([targetObs, entityObs]).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(([target, entity]) => {
      for (const col of target.entity.columns) {
        if (!col.tab) {
          col.tab = this.restTab;
          continue;
        }
        if (this.tabs.find(t => t.id === col.tab?.id)) {
          continue;
        }
        this.tabs.push(col.tab);
      }
      this.tabs.push(this.restTab);
      let title = this.localizePipe.transform(target.entity.name, target.entity.target) as string;
      title += ` #${entity[target.primaryColumn.property]}`;
      this.store.emit<string>(DashboardEvent.PatchHeader, title);
      this.targetData = target;
      this.entityData = entity;
      this.targetData.entity.columns.forEach(col => this.entityForm.addControl(
        col.property, new FormControl(this.entityData[col.property]))
      );
      this.cdr.markForCheck();
    });
  }

  saveObject() {
    this.store.emit<ExplorerObjectDto>(ExplorerEvent.SaveObject, {
      id: this.entityData[this.targetData.primaryColumn.property] as number,
      target: this.targetData.entity.target,
      entity: this.entityForm.getRawValue()
    });
  }

  deleteObject() {
    this.store.emit<ExplorerObjectDto>(ExplorerEvent.DeleteObject, {
      id: this.entityData[this.targetData.primaryColumn.property] as number,
      target: this.targetData.entity.target,
    });
  }

  private handleSaveEvent(data: StoreMessage<ExplorerObjectDto>) {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.explorerService.saveEntity(data.payload.entity, data.payload.target, data.payload.id).pipe(
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(() => {
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("explorer.msg.object.save.success")
      });
    });
  }

  private handleDeleteEvent(data: StoreMessage<ExplorerObjectDto>) {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.explorerService.removeEntity(data.payload.target, data.payload.id).pipe(
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(() => {
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("explorer.msg.object.delete.success")
      });
    });
  }

}

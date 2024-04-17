import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from "@angular/core";
import {ExplorerService} from "../explorer.service";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {ExplorerObjectRendererComponent} from "../renderer/explorer-object-renderer.component";
import {NgClass, NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TabViewModule} from "primeng/tabview";
import {TranslocoPipe} from "@ngneat/transloco";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {PreloaderComponent} from "@modules/preloader/preloader.component";
import {PreloaderDirective} from "@modules/preloader/preloader.directive";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputTextModule} from "primeng/inputtext";
import {ExplorerActionRendererComponent} from "../renderer/explorer-action-renderer.component";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {ExplorerObjectViewModel} from "@components/explorer/object/explorer-object.view-model";
import {DEVICE} from "@modules/device/device.constants";
import {ExplorerTab, ExplorerTabSize} from "@components/explorer/explorer.types";
import {Roles} from "@global/constants";
import {CurrentUser} from "@global/service/current-user";
import {Explorer} from "@components/explorer/explorer.constants";
import NewItemToken = Explorer.NewItemToken;
import DuplicateItemToken = Explorer.DuplicateItemToken;

@Component({
  selector: "explorer-object",
  standalone: true,
  templateUrl: "./explorer-object.component.html",
  styleUrls: ["./explorer-object.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExplorerObjectViewModel,
    ExplorerService,
    LocalizePipe,
    ConfirmationService
  ],
  imports: [
    ExplorerObjectRendererComponent,
    TabViewModule,
    TranslocoPipe,
    NgClass,
    ButtonModule,
    RippleModule,
    PreloaderComponent,
    PreloaderDirective,
    LocalizePipe,
    ConfirmDialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ExplorerActionRendererComponent,
    TooltipModule,
    NgTemplateOutlet,
    DialogModule,
  ],
})
export class ExplorerObjectComponent implements OnInit {

  activeTabIndex = 0;
  readonly vm = inject(ExplorerObjectViewModel);
  readonly device = inject(DEVICE);
  private readonly currentUser = inject(CurrentUser);

  get tabClassName() {
    const tabSize = this.vm.tabs[this.activeTabIndex]?.size;
    if (!tabSize) {
      return null;
    }
    const key: keyof ExplorerTabSize = this.device.isDesktop ? "desktop" : this.device.isTablet ? "tablet" : null;
    if (!key) {
      return null;
    }
    return `col-${tabSize[key]}`;
  }

  get canExport() {
    if (!this.vm.canDeleteObject) {
      return false;
    }
    return this.currentUser.hasSomeRole(Roles.ADMIN);
  }

  get canDuplicate() {
    return !this.vm.duplicateId && this.vm.targetData.entity.defaultActionDuplicate;
  }

  ngOnInit(): void {
    this.vm.initObject();
  }

  navBack() {
    history.back();
  }

  hasColumns(tab: ExplorerTab) {  // todo create pipe?
    return this.vm.targetData.entity.columns.find(v => v.tab.id === tab.id);
  }

  exportObject() {
    import("@components/xdb/xdb-export/xdb-export-dialog.component").then(c =>
      this.vm.dialogService.open(c.XdbExportDialogComponent, this.vm.exportDialogConfig));
  }

  duplicateObject() {
    const p1 = this.vm.entityTargetOrAlias;
    const prop = this.vm.targetData.primaryColumn.property;
    const url = `/object/${p1}/${NewItemToken}?${DuplicateItemToken}=${this.vm.entityData[prop]}`;
    window.open(url, "_blank");
  }

}

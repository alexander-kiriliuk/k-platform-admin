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

import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from "@angular/core";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerColumn, TargetData} from "../../explorer.types";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {SortOrder} from "../../../global/types";
import {ActivatedRoute, Router} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {SectionFilter} from "./section-filter-dialog.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {StringUtils} from "../../../global/util/string.utils";
import {ExplorerService} from "../../explorer.service";
import {PreloaderComponent} from "../../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../../../modules/preloader/preloader.event";
import {Store} from "../../../modules/store/store";
import {finalize} from "rxjs";
import parseParamsString = StringUtils.parseParamsString;
import stringifyParamsObject = StringUtils.stringifyParamsObject;
import createFieldFilterForm = SectionFilter.createFieldFilterForm;

@Component({
  selector: "section-filter-dialog",
  standalone: true,
  templateUrl: "./section-filter-dialog.component.html",
  styleUrls: ["./section-filter-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    InputTextModule,
    NgClass,
    NgIf,
    ButtonModule,
    ReactiveFormsModule,
    CheckboxModule,
    PreloaderComponent,
    PreloaderDirective
  ],
  providers: [ExplorerService]
})
export class SectionFilterDialogComponent implements AfterViewInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly router = inject(Router);
  private readonly ar = inject(ActivatedRoute);
  private readonly ref = inject(DynamicDialogRef);
  private readonly dialogService = inject(DialogService);
  private readonly explorerService = inject(ExplorerService);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly form = createFieldFilterForm();
  referencedTarget: TargetData;
  referencedColumn: ExplorerColumn;

  get preloaderChannel() {
    return SectionFilter.PreloaderCn;
  }

  get column() {
    return this.config.data as ExplorerColumn;
  }

  get isSortAscActive() {
    return this.ar.snapshot.queryParams["sort"] === this.column.property
      && (this.ar.snapshot.queryParams["order"] as SortOrder) === "ASC";
  }

  get isSortDescActive() {
    return this.ar.snapshot.queryParams["sort"] === this.column.property
      && (this.ar.snapshot.queryParams["order"] as SortOrder) === "DESC";
  }

  get isReference() {
    return this.column.type === "reference";
  }

  get referenceField() {
    if (this.referencedColumn) {
      return {value: "", ref: `${this.referencedTarget.entity.target}.${this.referencedColumn.property}`};
    }
    const queryParams = {...this.ar.snapshot.queryParams};
    if (!queryParams["filter"]?.length) {
      return undefined;
    }
    const filter = parseParamsString(queryParams["filter"]);
    const value = filter[this.column.property];
    if (!value?.length) {
      return undefined;
    }
    const clearValue = value.replace(/\{[^}]*}/g, "");
    const match = value.match(/\{([^}]*)}/);
    return {value: clearValue, ref: match[1]};
  }

  ngAfterViewInit(): void {
    if (this.isReference) {
      this.getReferenceTarget();
    }
    this.form.controls.name.setValue(this.column.property);
    const queryParams = {...this.ar.snapshot.queryParams};
    if (queryParams["filter"]?.length) {
      const filter = parseParamsString(queryParams["filter"]);
      let value = this.isReference ? this.referenceField?.value : filter[this.column.property];
      if (value?.length) {
        if (value.startsWith("%") && value.endsWith("%")) {
          this.form.controls.exactMatch.setValue(false);
          value = value.substring(1, value.length - 1);
        } else {
          this.form.controls.exactMatch.setValue(true);
        }
        this.form.controls.value.setValue(value);
      }
    }
    this.cdr.detectChanges();
  }

  setOrder(order: SortOrder) {
    const queryParams = {...this.ar.snapshot.queryParams};
    queryParams["sort"] = this.column.property;
    queryParams["order"] = order;
    queryParams["page"] = 1;
    this.router.navigate([], {queryParams});
    this.ref.close();
  }

  applyFilter() {
    const data = this.form.value;
    const value = !data.exactMatch ? `%${data.value}%` : data.value;
    const queryParams = {...this.ar.snapshot.queryParams};
    if (!queryParams["filter"]?.length) {
      queryParams["filter"] = `::${data.name}:${value}`;
    } else {
      const filter = parseParamsString(queryParams["filter"]);
      if (this.isReference) {
        filter[this.column.property] = `${value}{${this.referenceField.ref}}`;
      } else {
        filter[this.column.property] = value;
      }
      queryParams["filter"] = stringifyParamsObject(filter);
    }
    this.router.navigate([], {queryParams});
    this.ref.close();
  }

  showRefTargetDialog() {
    let selectedCol: string;
    if (this.referenceField?.ref) {
      const parts = this.referenceField.ref.split(".");
      selectedCol = parts[1];
    }
    import("./target/target-columns-dialog.component").then(m => {
      this.dialogService.open(m.TargetColumnsDialogComponent, {
        header: this.referencedTarget.entity.target,
        data: {target: this.referencedTarget, selected: selectedCol},
        modal: true,
        position: "top",
      }).onClose.subscribe((col: ExplorerColumn) => {
        this.referencedColumn = col;
        this.cdr.markForCheck();
      });
    });
  }

  private getReferenceTarget() {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.explorerService.getTarget(this.column.referencedEntityName).pipe(finalize(() => {
      this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
    })).subscribe(v => {
      this.referencedTarget = v;
      this.cdr.markForCheck();
    });
  }

}

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

import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerColumn} from "../../explorer.types";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {SortOrder} from "../../../global/types";
import {ActivatedRoute, Router} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {createFieldFilterForm} from "./section-filter-dialog.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";

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
    CheckboxModule
  ],
})
export class SectionFilterDialogComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly router = inject(Router);
  private readonly ar = inject(ActivatedRoute);
  private readonly ref = inject(DynamicDialogRef);
  readonly form = createFieldFilterForm();

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

  ngOnInit(): void {
    if (this.column.type !== "reference") {
      this.form.controls.name.setValue(this.column.property);
    }
  }

  setOrder(order: SortOrder) {
    this.router.navigate([], {queryParams: {sort: this.column.property, order}});
    this.ref.close();
  }

  applyFilter() {
    const data = this.form.value;
    const value = !data.exactMatch ? `%${data.value}%` : data.value;
    const queryParams = {...this.ar.snapshot.queryParams};
    queryParams["filter"] = `::${data.name}:${value}`;
    this.router.navigate([], {queryParams});
    this.ref.close();
  }

}

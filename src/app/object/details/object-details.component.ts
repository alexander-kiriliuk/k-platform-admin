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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerService} from "../../explorer/explorer.service";
import {finalize, Observable, tap} from "rxjs";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {Store} from "../../modules/store/store";
import {ObjectDetails} from "./object-details.constants";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {ExplorerColumn, TargetData} from "../../explorer/explorer.types";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {AccordionModule} from "primeng/accordion";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {ButtonModule} from "primeng/button";
import {
LocalizeStringInputComponent
} from "../../modules/locale/string-input/localize-string-input.component";
import {map} from "rxjs/operators";
import {MediaInputComponent} from "../../modules/media/input/media-input.component";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {Explorer} from "../../explorer/explorer.constants";
import {RefInputComponent} from "../../modules/ref-input/ref-input.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {
onlyLatinLettersAndNumbersValidator
} from "../../global/validator/only-latin-letters-and-numbers.validator";
import {ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";
import createForm = ObjectDetails.createTargetForm;
import createColumnForm = ObjectDetails.createColumnForm;
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: "object-details",
  standalone: true,
  templateUrl: "./object-details.component.html",
  styleUrls: ["./object-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreloaderComponent,
    PreloaderDirective,
    AsyncPipe,
    NgIf,
    LocalizePipe,
    NgForOf,
    AccordionModule,
    InputTextModule,
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonModule,
    LocalizeStringInputComponent,
    MediaInputComponent,
    InputNumberModule,
    CheckboxModule,
    AutoCompleteModule,
    RefInputComponent,
    ConfirmDialogModule,
    NgClass,
    InputTextareaModule
  ],
  providers: [
    ExplorerService,
    ConfirmationService
  ]
})
export class ObjectDetailsComponent {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly explorerService = inject(ExplorerService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly store = inject(Store);
  private readonly ts = inject(TranslocoService);
  readonly target$: Observable<TargetData>;
  readonly form = createForm();
  suggestions: string[] = [];
  newColName: FormControl<string> = new FormControl(null, [
    Validators.required,
    onlyLatinLettersAndNumbersValidator()
  ]);

  constructor() {
    this.target$ = this.explorerService.getTarget(this.target).pipe(
      tap(() => this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel)),
      map(target => {
        this.form.patchValue(target.entity);
        target.entity.columns.forEach(col => this.form.controls.columns.push(createColumnForm(col)));
        return target;
      }),
      finalize(() => this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel)),
    );
  }

  get target() {
    return this.config.data as string;
  }

  get preloaderChannel() {
    return ObjectDetails.PreloaderCn;
  }

  searchType(e: AutoCompleteCompleteEvent) {
    this.suggestions = Explorer.Types.filter(s => s.startsWith(e.query.trim()));
    this.cdr.markForCheck();
  }

  saveObject() {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.explorerService.saveTarget(this.form.getRawValue()).pipe(
      finalize(() => this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel))
    ).subscribe(v => {
      this.form.patchValue(v);
      v.columns.forEach(col => this.form.controls.columns.push(createColumnForm(col)));
    });
  }

  addVirtualColumn() {
    this.newColName.reset();
    this.confirmationService.confirm({
      accept: () => {
        const propName = this.newColName.value;
        const exists = this.form.controls.columns.getRawValue()
          .find(v => v.property === propName);
        if (exists) {
          this.store.emit<ToastData>(ToastEvent.Warn, {
            title: this.ts.translate("object.details.col.new.warn")
          });
          return;
        }
        const newCol = createColumnForm({
          id: `${this.form.value.tableName}.${propName}`,
          property: propName,
          virtual: true
        } as ExplorerColumn);
        newCol.controls.type.setValue("unknown");
        newCol.controls.sectionPriority.setValue(0);
        newCol.controls.sectionEnabled.setValue(false);
        newCol.controls.objectPriority.setValue(0);
        newCol.controls.objectEnabled.setValue(false);
        this.form.controls.columns.push(newCol);
        this.store.emit<ToastData>(ToastEvent.Success, {
          title: this.ts.translate("object.details.col.new.success")
        });
      }
    });
  }

}

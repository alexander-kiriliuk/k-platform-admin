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
import {DialogService} from "primeng/dynamicdialog";
import {ExplorerService} from "@components/explorer/explorer.service";
import {PreloaderComponent} from "@modules/preloader/preloader.component";
import {PreloaderDirective} from "@modules/preloader/preloader.directive";
import {AsyncPipe, NgClass} from "@angular/common";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@ngneat/transloco";
import {ButtonModule} from "primeng/button";
import {
LocalizeStringInputComponent
} from "@modules/locale/string-input/localize-string-input.component";
import {MediaInputComponent} from "@modules/media/input/media-input.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RefInputComponent} from "@modules/ref-input/ref-input.component";
import {CheckboxModule} from "primeng/checkbox";
import {ObjectDetailsViewModel} from "@components/object/details/object-details.view-model";
import {finalize, Observable, tap} from "rxjs";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {map} from "rxjs/operators";
import {TargetData} from "@components/explorer/explorer.types";
import {ObjectDetails} from "@components/object/details/object-details.constants";
import {Store} from "@modules/store/store";
import createColumnForm = ObjectDetails.createColumnForm;

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
    LocalizePipe,
    InputTextModule,
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonModule,
    LocalizeStringInputComponent,
    ConfirmDialogModule,
    NgClass,
    MediaInputComponent,
    InputNumberModule,
    InputTextareaModule,
    RefInputComponent,
    CheckboxModule,
  ],
  providers: [
    ObjectDetailsViewModel,
    DialogService,
    ExplorerService,
    ConfirmationService
  ]
})
export class ObjectDetailsComponent {

  readonly vm = inject(ObjectDetailsViewModel);
  readonly target$: Observable<TargetData>;
  private readonly explorerService = inject(ExplorerService);
  private readonly store = inject(Store);

  constructor() {
    this.target$ = this.explorerService.getTarget(this.vm.target).pipe(
      tap(() => this.store.emit(PreloaderEvent.Show, this.vm.preloaderChannel)),
      map(target => {
        this.vm.targetForm.patchValue(target.entity);
        target.entity.columns.forEach(col => this.vm.targetForm.controls.columns.push(createColumnForm(col)));
        return target;
      }),
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.vm.preloaderChannel)),
    );
  }

}

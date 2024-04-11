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
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from "@modules/store/store";
import {XdbService} from "../xdb.service";
import {Xdb} from "../xdb.constants";
import {PreloaderComponent} from "@modules/preloader/preloader.component";
import {PreloaderDirective} from "@modules/preloader/preloader.directive";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {finalize, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ToastData} from "@global/types";
import {DashboardEvent, ToastEvent} from "@global/events";
import {FileUploadErrorEvent, FileUploadEvent, FileUploadModule} from "primeng/fileupload";

@Component({
  selector: "xdb-import",
  standalone: true,
  templateUrl: "./xdb-import.component.html",
  styleUrls: ["./xdb-import.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    XdbService
  ],
  imports: [
    InputTextareaModule,
    ButtonModule,
    RippleModule,
    TranslocoPipe,
    ReactiveFormsModule,
    PreloaderComponent,
    PreloaderDirective,
    FileUploadModule
  ],
})
export class XdbImportComponent {

  readonly ctrl: FormControl<string> = new FormControl("", [Validators.required]);
  private readonly ts = inject(TranslocoService);
  private readonly xdbService = inject(XdbService);
  private readonly store = inject(Store);

  get preloaderChannel() {
    return Xdb.PreloaderCn;
  }

  get uploadUrl() {
    return "/xdb/import-file";
  }

  constructor() {
    this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("xdb.title"));
  }

  onBeforeUploadFile() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
  }

  onUploadFile(payload: FileUploadEvent) {
    this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
    this.store.emit<ToastData>(ToastEvent.Success, {
      title: this.ts.translate("xdb.success.upload"), message: payload.files[0].name
    });
  }

  onErrorFileUpload(payload: FileUploadErrorEvent) {
    this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
    this.store.emit<ToastData>(ToastEvent.Error, {
      title: payload.error.error.message, message: payload.error.error.statusCode
    });
  }

  doImport() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.xdbService.importData(this.ctrl.value).pipe(
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(() => {
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("xdb.success.import")
      });
    });
  }

}

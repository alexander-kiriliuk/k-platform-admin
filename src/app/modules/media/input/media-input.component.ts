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
  EventEmitter,
  inject,
  Input,
  Output
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {FileUploadEvent, Media} from "../media.types";
import {FileUploadErrorEvent, FileUploadModule} from "primeng/fileupload";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {HttpResponse} from "@angular/common/http";
import {FileSizePipe} from "../../../global/service/file-size.pipe";
import {MediaComponent} from "../media.component";
import {LocalizePipe} from "../../locale/localize.pipe";
import {MediaTypeVariant} from "../media.constants";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {DialogService} from "primeng/dynamicdialog";
import {SectionDialogConfig} from "../../../explorer/explorer.types";
import {ExplorerService} from "../../../explorer/explorer.service";
import {finalize} from "rxjs";
import {ToastData} from "../../../global/types";
import {ToastEvent} from "../../../global/events";
import {Store} from "../../store/store";

@Component({
  selector: "media-input",
  standalone: true,
  templateUrl: "./media-input.component.html",
  styleUrls: ["./media-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FileUploadModule,
    NgIf,
    NgForOf,
    FileSizePipe,
    MediaComponent,
    LocalizePipe,
    TranslocoPipe,
    NgTemplateOutlet
  ],
  providers: [
    ExplorerService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MediaInputComponent
    },
  ]
})
export class MediaInputComponent implements ControlValueAccessor {

  @Output() changeMedia = new EventEmitter<Media | Media[]>();
  @Input({required: true}) mediaType: MediaTypeVariant;
  @Input() url: string = "/media/upload";
  @Input() mediaId: number;
  @Input() placeholder: string;
  @Input() multi: boolean;
  @Input() galleryEnabled = true;
  disabled = false;
  uploadedFiles: File[];
  data: Media | Media[];
  targetLoadingState: boolean;
  private readonly store = inject(Store);
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly explorerService = inject(ExplorerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ts = inject(TranslocoService);

  get uploadUrl() {
    return `/media/upload/${(this.mediaType)}${!this.mediaId ? "" : `?id=${this.mediaId}`}`;
  }

  get multiValue() {
    return this.data as Media[];
  }

  get singleValue() {
    return this.data as Media;
  }

  writeValue(res: Media | Media[]) {
    if (!res) {
      return;
    }
    this.data = res;
    this.cdr.markForCheck();
  }

  onUpload(event: FileUploadEvent) {
    this.uploadedFiles = [];
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    const res = (event.originalEvent as HttpResponse<Media>).body;
    if (this.multi) {
      if (!this.data) {
        this.data = [];
      }
      (this.data as Media[]).push(res);
    } else {
      this.data = res;
    }
    this.synchronize();
    this.cdr.markForCheck();
    setTimeout(() => {
      this.uploadedFiles = undefined;
      this.cdr.markForCheck();
    }, 3000);
  }

  onUploadError(e: FileUploadErrorEvent) {
    this.store.emit<ToastData>(ToastEvent.Error, {
      title: this.ts.translate("msg.error"), message: e.error.error?.message || e.error.error?.status
    });
  }

  openMediaSection() {
    this.targetLoadingState = true;
    this.explorerService.getTarget("MediaEntity", "section").pipe(finalize(() => {
      this.targetLoadingState = false;
      this.cdr.markForCheck();
    })).subscribe(payload => {
      import("../../../explorer/section/section.component").then(m => {
        this.dialogService.open(m.SectionComponent, {
          header: this.localizePipe.transform(payload.entity.name, payload.entity.target) as string,
          data: {target: payload, multi: this.multi} as SectionDialogConfig,
          modal: true,
          position: "top",
        }).onClose.subscribe((res: Media | Media[]) => {
          if (!res) {
            return;
          }
          if (this.multi) {
            if (!this.data) {
              this.data = [];
            }
            this.data = (this.data as Media[]).concat(res);
          } else {
            this.data = res;
          }
          this.synchronize();
          this.cdr.markForCheck();
        });
      });
    });
  }

  removeUploadedMedia(idx: number) {
    if (!this.multi) {
      this.data = undefined;
    } else {
      (this.data as Media[]).splice(idx, 1);
    }
    this.synchronize();
    this.cdr.markForCheck();
  }

  synchronize() {
    this.onChange(this.data);
    this.changeMedia.emit(this.data);
  }

  registerOnChange(onChange: () => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }

  onChange = (res: Media | Media[]) => {
  };

  onTouched = () => {
  };

}

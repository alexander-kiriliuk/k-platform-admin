import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Media} from "../media.types";
import {FileUploadModule, UploadEvent} from "primeng/fileupload";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {HttpResponse} from "@angular/common/http";
import {FileSizePipe} from "../../../global/service/file-size.pipe";
import {MediaComponent} from "../media.component";
import {LocalizePipe} from "../../locale/localize.pipe";
import {MediaSize} from "../media.constants";
import {TranslocoPipe} from "@ngneat/transloco";
import {DialogService} from "primeng/dynamicdialog";
import {SectionDialogConfig} from "../../../explorer/explorer.types";
import {ExplorerService} from "../../../explorer/explorer.service";
import {finalize} from "rxjs";

interface FileUploadEvent extends UploadEvent {
  files: File[];
}

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
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MediaInputComponent
    },
  ]
})
export class MediaInputComponent implements ControlValueAccessor {

  @Input({required: true}) mediaSize: MediaSize;
  @Input() url: string = "/media/upload";
  @Input() placeholder: string;
  @Input() multi: boolean;
  disabled = false;
  uploadedFiles: File[];
  data: Media | Media[];
  targetLoadingState: boolean;
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly explorerService = inject(ExplorerService);
  private readonly cdr = inject(ChangeDetectorRef);

  get uploadUrl() {
    return `/media/upload/${(this.mediaSize)}`;
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

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
  Component,
  HostBinding,
  inject,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import {Media} from "./media.types";
import {MediaFormat, ReservedMediaFormat} from "./media.constants";
import {ImageModule} from "primeng/image";
import {LocalizePipe} from "../locale/localize.pipe";
import {MediaUrlPipe} from "./media-url.pipe";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "media-res",
  standalone: true,
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImageModule,
    LocalizePipe
  ],
  providers: [MediaUrlPipe]
})
export class MediaComponent implements OnChanges {

  @Input({required: true}) src: Media;
  @Input() format: MediaFormat = ReservedMediaFormat.ORIGINAL;
  @Input() background: boolean;
  @Input() zoom: boolean;
  private readonly localizePipe = inject(LocalizePipe);
  private readonly mediaUrlPipe = inject(MediaUrlPipe);
  private readonly sanitizer = inject(DomSanitizer);

  @HostBinding("class.background")
  private get cssClass() {
    return this.background;
  }

  @HostBinding("class.has-preview")
  private get previewClass() {
    return this.zoom;
  }

  @HostBinding("style")
  private get styleAttr() {
    if (!this.background) {
      return undefined;
    }
    return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.url});`);
  }

  private getUrl(format: string) {
    return this.mediaUrlPipe.transform(this.src, format);
  }

  get url() {
    return this.getUrl(this.format);
  }

  get file() {
    return this.src?.files?.find(v => v.format.code === this.format);
  }

  get width() {
    return this.file?.width ? this.file.width.toString() : undefined;
  }

  get height() {
    return this.file?.height ? this.file.height.toString() : undefined;
  }

  get originalUrl() {
    return this.getUrl(ReservedMediaFormat.ORIGINAL);
  }

  get alt(): string {
    return this.localizePipe.transform(this.src?.name) as string;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const ext = changes.src?.currentValue?.type?.ext?.code;
    if (ext === "svg") {
      this.format = ReservedMediaFormat.ORIGINAL;
    }
  }

}

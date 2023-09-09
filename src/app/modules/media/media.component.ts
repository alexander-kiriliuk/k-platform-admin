import {ChangeDetectionStrategy, Component, HostBinding, inject, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Media} from "./media.types";
import {ReservedMediaSize} from "./media.constants";
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
  imports: [CommonModule, ImageModule, LocalizePipe],
  providers: [MediaUrlPipe]
})
export class MediaComponent {

  @Input() src: Media;
  @Input() format: string = ReservedMediaSize.THUMB;
  @Input() background: boolean;
  @Input() zoom: boolean;
  private readonly localizePipe = inject(LocalizePipe);
  private readonly mediaUrlPipe = inject(MediaUrlPipe);
  private readonly sanitizer = inject(DomSanitizer);

  @HostBinding("class.background")
  private get cssClass() {
    return this.background;
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
    return this.src.files.find(v => v.format.code === this.format);
  }

  get width() {
    return this.file.width ? this.file.width.toString() : undefined;
  }

  get height() {
    return this.file.height ? this.file.height.toString() : undefined;
  }

  get originalUrl() {
    return this.getUrl(ReservedMediaSize.ORIGINAL);
  }

  get alt(): string {
    return this.localizePipe.transform(this.src.name) as string;
  }

}

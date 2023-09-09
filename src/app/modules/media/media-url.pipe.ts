import {inject, Pipe, PipeTransform} from "@angular/core";
import {Media} from "./media.types";
import {ReservedMediaSize, WEBP_SUPPORT} from "./media.constants";
import {environment} from "../../global/env/env";

@Pipe({
  name: "mediaUrl",
  standalone: true
})
export class MediaUrlPipe implements PipeTransform {

  private readonly webpSupport = inject(WEBP_SUPPORT);

  transform(media: Media, format: string = ReservedMediaSize.THUMB) {
    if (!media) {
      return undefined;
    }
    const ext = this.webpSupport && media.type.vp6 ? "webp" : media.type.ext.code;
    const file = media.files.find(v => v.format.code === format);
    const fileName = `${file.name}.${ext}`;
    return `${environment.mediaUrl}/${media.id}/${fileName}`;
  }

}

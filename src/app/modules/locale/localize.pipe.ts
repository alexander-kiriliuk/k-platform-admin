import {inject, Pipe, PipeTransform} from "@angular/core";
import {LocalizedMedia, LocalizedString} from "./locale.types";
import {TranslocoService} from "@ngneat/transloco";
import {Media} from "../media/media.types";

@Pipe({
  name: "localize",
  standalone: true
})
export class LocalizePipe implements PipeTransform {

  private readonly ts = inject(TranslocoService);

  transform(incomeValue: Array<LocalizedString | LocalizedMedia>, fallbackValue?: string): string | Media {
    const lang = this.ts.getActiveLang();
    const res = incomeValue?.find(v => v.lang.id === lang);
    if (!res) {
      return fallbackValue;
    }
    return res.value;
  }

}

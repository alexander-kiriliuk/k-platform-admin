import {inject, Pipe, PipeTransform} from "@angular/core";
import {PlainObject} from "../../global/types";
import {TargetData} from "../../explorer/explorer.types";
import {LocalizedString} from "../locale/locale.types";
import {LocalizePipe} from "../locale/localize.pipe";

@Pipe({
  name: "refName",
  standalone: true
})
export class RefNamePipe implements PipeTransform {

  private readonly localizePipe = inject(LocalizePipe);

  transform(entity: PlainObject, target: TargetData) {
    if (!target) {
      return "";
    }
    const val = entity[target.namedColumn.property];
    if (val) {
      if (target.namedColumn.referencedEntityName === "LocalizedStringEntity") {
        return this.localizePipe.transform(
          val as LocalizedString[], entity[target.primaryColumn.property] as string
        );
      }
    }
    return entity[target.primaryColumn.property];
  }

}

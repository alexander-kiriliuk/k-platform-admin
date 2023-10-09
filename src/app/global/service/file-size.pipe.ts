import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "fileSize",
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(value: number): string {
    if (value > 1024 * 500) {
      return (value / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (value / 1024).toFixed(2) + " KB";
    }
  }

}

import {Directive, HostListener} from "@angular/core";

@Directive({
  selector: "[stop-propagation]"
})
export class StopPropagationDirective {

  @HostListener("click", ["$event"])
  onClick(e: Event): void {
    e.stopPropagation();
  }

}

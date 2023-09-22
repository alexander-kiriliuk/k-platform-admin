import {Directive, HostListener} from "@angular/core";

@Directive({
  selector: "[prevent-default]",
  standalone: true
})
export class PreventDefaultDirective {

  @HostListener("click", ["$event"])
  onClick(e: Event): void {
    e.preventDefault();
  }

}

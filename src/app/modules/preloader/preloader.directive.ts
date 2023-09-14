import {AfterViewInit, Directive, inject, Input, TemplateRef, ViewContainerRef} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Store} from "../store/store";
import {PreloaderEvent} from "./preloader.event";
import {TogglePreloader} from "./preloader.types";
import {filter} from "rxjs/operators";

@UntilDestroy()
@Directive({
  selector: "[preloading]",
  standalone: true
})
export class PreloaderDirective implements AfterViewInit {

  @Input("preloading") ctx: TogglePreloader = {state: true};
  private readonly store = inject(Store);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef) {
    this.store.on<string>(PreloaderEvent.Hide)
      .pipe(
        filter(v => v.payload === this.ctx.channel),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.ctx.state = false;
        this.checkContainer();
      });
    this.store.on<string>(PreloaderEvent.Show)
      .pipe(
        filter(v => v.payload === this.ctx.channel),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.ctx.state = true;
        this.checkContainer();
      });
  }

  ngAfterViewInit(): void {
    this.checkContainer();
  }

  private checkContainer() {
    if (this.ctx.state) {
      this.viewContainer.createEmbeddedView(this.templateRef, {});
    } else {
      this.viewContainer.clear();
    }
  }

}

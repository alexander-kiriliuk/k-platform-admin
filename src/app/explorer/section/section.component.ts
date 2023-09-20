import {AfterViewInit, ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {ExplorerService} from "../explorer.service";
import {finalize, skip, throwError} from "rxjs";
import {Explorer} from "../explorer.constants";
import {Store} from "../../modules/store/store";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {ActivatedRoute} from "@angular/router";
import {catchError} from "rxjs/operators";
import {ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "section",
  standalone: true,
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PreloaderComponent, PreloaderDirective],
  providers: [ExplorerService]
})
export class SectionComponent implements AfterViewInit {

  private readonly sectionService = inject(ExplorerService);
  private readonly store = inject(Store);
  private readonly ar = inject(ActivatedRoute);
  private target: string;

  get preloaderChannel() {
    return Explorer.SectionPrCn;
  }

  ngAfterViewInit(): void {
    this.ar.params.pipe(untilDestroyed(this)).subscribe(v => {
      this.target = v["target"];
      this.getTarget();
    });
    this.ar.queryParams.pipe(skip(1), untilDestroyed(this)).subscribe(v => {
      this.getSection();
    });
  }

  private getSection() {
    this.sectionService.getSectionList(this.target, null).pipe(
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(v => {
      console.log(v);
      // todo
    });
  }

  private getTarget() {
    this.sectionService.getTarget(this.target).pipe(
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(v => {
      console.log(v);
      // todo
      this.getSection();
    });
  }

}

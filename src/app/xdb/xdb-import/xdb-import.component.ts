import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DashboardEvent} from "../../dashboard/dashboard.event";
import {Store} from "../../modules/store/store";
import {XdbService} from "../xdb.service";
import {XdbConstants} from "../xdb.constants";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {finalize, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";

@Component({
  selector: "xdb-import",
  standalone: true,
  templateUrl: "./xdb-import.component.html",
  styleUrls: ["./xdb-import.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    XdbService
  ],
  imports: [
    InputTextareaModule,
    ButtonModule,
    RippleModule,
    TranslocoPipe,
    ReactiveFormsModule,
    PreloaderComponent,
    PreloaderDirective
  ],
})
export class XdbImportComponent implements OnInit {

  readonly ctrl: FormControl<string> = new FormControl("", [Validators.required]);
  private readonly ts = inject(TranslocoService);
  private readonly xdbService = inject(XdbService);
  private readonly store = inject(Store);

  get preloaderChannel() {
    return XdbConstants.PreloaderCn;
  }

  ngOnInit(): void {
    this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("xdb.title"));
  }

  doImport() {
    this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel);
    this.xdbService.importData(this.ctrl.value).pipe(
      finalize(() => {
        this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel);
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(() => {
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("xdb.success.import")
      });
    });
  }

}

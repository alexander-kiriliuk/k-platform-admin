import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import {NgIf, NgSwitchCase} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {XdbService} from "../xdb.service";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {Xdb} from "../xdb.constants";
import {Store} from "../../modules/store/store";
import {XdbExportDialogParams} from "../xdb.types";
import {CheckboxModule} from "primeng/checkbox";
import {ListboxModule} from "primeng/listbox";
import {XdbExportDialog} from "./xdb-export-dialog.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {catchError} from "rxjs/operators";
import {ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";
import {finalize, throwError} from "rxjs";
import createForm = XdbExportDialog.createForm;
import {InputNumberModule} from "primeng/inputnumber";
import {environment} from "../../global/env/env";

@Component({
  selector: "xdb-export-dialog",
  standalone: true,
  templateUrl: "./xdb-export-dialog.component.html",
  styleUrls: ["./xdb-export-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    XdbService, LocalizePipe
  ],
  imports: [
    ButtonModule,
    NgIf,
    RippleModule,
    TranslocoPipe,
    PreloaderComponent,
    PreloaderDirective,
    CheckboxModule,
    ListboxModule,
    ReactiveFormsModule,
    InputNumberModule,
    NgSwitchCase,
  ]
})
export class XdbExportDialogComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly store = inject(Store);
  private readonly xdbService = inject(XdbService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly ts = inject(TranslocoService);
  readonly form = createForm();
  properties: Array<{ name: string, code: string }> = [];

  get preloaderChannel() {
    return Xdb.PreloaderCn;
  }

  get data() {
    return this.config.data as XdbExportDialogParams;
  }

  ngOnInit() {
    this.form.controls.id.setValue(this.data.entity[this.data.target.primaryColumn.property] as string);
    this.form.controls.target.setValue(this.data.target.entity.target);
    this.data.target.entity.columns.forEach(col => {
      this.properties.push({
        code: col.property,
        name: this.localizePipe.transform(col.name, col.property) as string
      });
    });
  }

  export() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.xdbService.exportData(this.form.getRawValue()).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(() => res);
      }),
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel))
    ).subscribe(v => {
      this.store.emit<ToastData>(ToastEvent.Success, {message: this.ts.translate("xdb.export.success")});
      if (v.file) {
        window.open(`${environment.tmpUrl}/${v.file}`, "_blank");
      }
      this.ref.close();
    });
  }

}

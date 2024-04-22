import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe} from "@ngneat/transloco";
import {XdbService} from "../xdb.service";
import {PreloaderComponent} from "@modules/preloader/preloader.component";
import {PreloaderDirective} from "@modules/preloader/preloader.directive";
import {XdbExportDialogParams} from "../xdb.types";
import {CheckboxModule} from "primeng/checkbox";
import {ListboxModule} from "primeng/listbox";
import {ReactiveFormsModule} from "@angular/forms";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {InputNumberModule} from "primeng/inputnumber";
import {XdbExportDialogViewModel} from "@components/xdb/xdb-export/xdb-export-dialog.view-model";

@Component({
  selector: "xdb-export-dialog",
  standalone: true,
  templateUrl: "./xdb-export-dialog.component.html",
  styleUrls: ["./xdb-export-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    XdbExportDialogViewModel,
    XdbService,
    LocalizePipe
  ],
  imports: [
    ButtonModule,
    RippleModule,
    TranslocoPipe,
    PreloaderComponent,
    PreloaderDirective,
    CheckboxModule,
    ListboxModule,
    ReactiveFormsModule,
    InputNumberModule,
  ]
})
export class XdbExportDialogComponent {

  private readonly config = inject(DynamicDialogConfig);
  private readonly localizePipe = inject(LocalizePipe);
  readonly vm = inject(XdbExportDialogViewModel);
  readonly properties: Array<{ name: string, code: string }> = [];

  constructor() {
    this.vm.form.controls.id.setValue(this.data.entity[this.data.target.primaryColumn.property] as string);
    this.vm.form.controls.target.setValue(this.data.target.entity.target);
    this.data.target.entity.columns.forEach(col => {
      this.properties.push({
        code: col.property,
        name: this.localizePipe.transform(col.name, col.property) as string
      });
    });
  }

  get data() {
    return this.config.data as XdbExportDialogParams;
  }

}

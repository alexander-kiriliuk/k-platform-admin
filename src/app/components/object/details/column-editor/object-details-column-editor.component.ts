import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from "@angular/core";
import {
LocalizeStringInputComponent
} from "@modules/locale/string-input/localize-string-input.component";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RefInputComponent} from "@modules/ref-input/ref-input.component";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextareaModule} from "primeng/inputtextarea";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {ColumnForm} from "@components/object/object.types";
import {Explorer} from "@components/explorer/explorer.constants";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerService} from "@components/explorer/explorer.service";
import {ButtonModule} from "primeng/button";

@Component({
  selector: "object-details-column-editor",
  standalone: true,
  templateUrl: "./object-details-column-editor.component.html",
  styleUrls: ["./object-details-column-editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizeStringInputComponent,
    ReactiveFormsModule,
    RefInputComponent,
    AutoCompleteModule,
    InputNumberModule,
    CheckboxModule,
    InputTextareaModule,
    TranslocoPipe,
    InputTextModule,
    ButtonModule
  ],
  providers: [
    ExplorerService
  ]
})
export class ObjectDetailsColumnEditorComponent {


  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  suggestions: string[] = [];
  private readonly cdr = inject(ChangeDetectorRef);

  get colForm() {
    return this.config.data as FormGroup<ColumnForm>;
  }

  searchType(e: AutoCompleteCompleteEvent) {
    this.suggestions = Explorer.Types.filter(s => s.startsWith(e.query.trim()));
    this.cdr.markForCheck();
  }

  save() {
    this.ref.close(this.colForm);
  }

}

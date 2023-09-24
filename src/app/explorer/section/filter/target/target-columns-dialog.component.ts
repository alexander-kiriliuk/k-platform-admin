import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerColumn, TargetData} from "../../../explorer.types";
import {LocalizePipe} from "../../../../modules/locale/localize.pipe";

@Component({
  selector: "target-columns-dialog",
  standalone: true,
  templateUrl: "./target-columns-dialog.component.html",
  styleUrls: ["./target-columns-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LocalizePipe]
})
export class TargetColumnsDialogComponent {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  get data() {
    return this.config.data as { target: TargetData, selected: string };
  }

  setColumn(col: ExplorerColumn) {
    this.ref.close(col);
  }

}

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerService} from "../../explorer/explorer.service";
import {finalize, Observable, tap} from "rxjs";
import {PreloaderEvent} from "../../modules/preloader/preloader.event";
import {Store} from "../../modules/store/store";
import {ObjectDetails} from "./object-details.constants";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {TargetData} from "../../explorer/explorer.types";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {AccordionModule} from "primeng/accordion";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@ngneat/transloco";
import {ButtonModule} from "primeng/button";
import {
  LocalizeStringInputComponent
} from "../../modules/locale/input/localize-string-input.component";
import {map} from "rxjs/operators";
import createForm = ObjectDetails.createForm;
import {MediaInputComponent} from "../../modules/media/input/media-input.component";

@Component({
  selector: "object-details",
  standalone: true,
  templateUrl: "./object-details.component.html",
  styleUrls: ["./object-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreloaderComponent,
    PreloaderDirective,
    AsyncPipe,
    NgIf,
    LocalizePipe,
    NgForOf,
    AccordionModule,
    InputTextModule,
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonModule,
    LocalizeStringInputComponent,
    MediaInputComponent
  ],
  providers: [ExplorerService]
})
export class ObjectDetailsComponent {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly explorerService = inject(ExplorerService);
  private readonly store = inject(Store);
  readonly target$: Observable<TargetData>;
  readonly form = createForm();

  constructor() {
    this.target$ = this.explorerService.getTarget(this.target, "object").pipe(
      tap(() => this.store.emit<string>(PreloaderEvent.Show, this.preloaderChannel)),
      map(target => {
        this.form.patchValue(target.entity);
        return target;
      }),
      finalize(() => this.store.emit<string>(PreloaderEvent.Hide, this.preloaderChannel)),
    );
  }

  get target() {
    return this.config.data as string;
  }

  get preloaderChannel() {
    return ObjectDetails.ObjectsDetailsPrCn;
  }

  saveObject() {
    console.log(this.form.value);
  }

}

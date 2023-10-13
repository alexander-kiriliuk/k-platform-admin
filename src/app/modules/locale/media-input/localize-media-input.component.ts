import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input} from "@angular/core";
import {Language, LocalizedMedia} from "../locale.types";
import {NumberUtils} from "../../../global/util/number.utils";
import {AVAIL_LANGS} from "../locale.constants";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {
ControlValueAccessor,
FormsModule,
NG_VALUE_ACCESSOR,
ReactiveFormsModule
} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MediaComponent} from "../../media/media.component";
import {NgForOf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {TabViewModule} from "primeng/tabview";
import {MediaInputComponent} from "../../media/input/media-input.component";
import {MediaSize} from "../../media/media.constants";

@Component({
  selector: "localize-media-input",
  standalone: true,
  templateUrl: "./localize-media-input.component.html",
  styleUrls: ["./localize-media-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputTextareaModule,
    MediaComponent,
    NgForOf,
    ReactiveFormsModule,
    SharedModule,
    TabViewModule,
    FormsModule,
    MediaInputComponent,
    TranslocoPipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LocalizeMediaInputComponent
    },
  ]
})
export class LocalizeMediaInputComponent  implements ControlValueAccessor {
  @Input() placeholder: string;
  @Input({required: true}) mediaSize: MediaSize;
  resData: { [k: string]: LocalizedMedia };
  disabled = false;
  activeTab = 0;
  readonly id = `lsi-${NumberUtils.getRandomInt()}`;
  readonly langList: Language[] = [];
  private readonly availableLangs = inject(AVAIL_LANGS);
  private readonly ts = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.langList = this.availableLangs.filter(v => v.id === this.ts.getActiveLang());
    for (const v of this.availableLangs) {
      if (v.id !== this.ts.getActiveLang()) {
        this.langList.push(v);
      }
    }
  }

  writeValue(res: LocalizedMedia[]) {
    if (!res) {
      this.initEmptyValues();
      return;
    }
    this.resData = {};
    for (const v of res) {
      this.resData[v.lang.id] = v;
    }
    this.synchronize();
    this.cdr.markForCheck();
  }

  synchronize() {
    const res: LocalizedMedia[] = [];
    for (const k in this.resData) {
      res.push(this.resData[k]);
    }
    this.onChange(res);
  }

  registerOnChange(onChange: () => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }

  onChange = (res: LocalizedMedia[]) => {
  };

  onTouched = () => {
  };

  private initEmptyValues() {
    this.resData = {};
    for (const lang of this.availableLangs) {
      this.resData[lang.id] = {value: null, lang} as LocalizedMedia;
    }
    this.synchronize();
  }

}

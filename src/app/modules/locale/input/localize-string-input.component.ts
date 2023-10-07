import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input} from "@angular/core";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Language, LocalizedString} from "../locale.types";
import {AVAIL_LANGS} from "../locale.constants";
import {TabViewModule} from "primeng/tabview";
import {NgForOf} from "@angular/common";
import {MediaComponent} from "../../media/media.component";
import {TranslocoService} from "@ngneat/transloco";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NumberUtils} from "../../../global/util/number.utils";

@Component({
  selector: "localize-string-input",
  standalone: true,
  templateUrl: "./localize-string-input.component.html",
  styleUrls: ["./localize-string-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TabViewModule,
    NgForOf,
    MediaComponent,
    InputTextareaModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LocalizeStringInputComponent
    },
  ]
})
export class LocalizeStringInputComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  resData: { [k: string]: LocalizedString };
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

  writeValue(res: LocalizedString[]) {
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
    const res: LocalizedString[] = [];
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

  onChange = (res: LocalizedString[]) => {
  };

  onTouched = () => {
  };

  private initEmptyValues() {
    this.resData = {};
    for (const v of this.availableLangs) {
      this.resData[v.id] = {value: null} as LocalizedString;
    }
    this.synchronize();
  }

}

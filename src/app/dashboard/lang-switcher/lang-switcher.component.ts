import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {FormControl} from "@angular/forms";
import {LangUtils} from "../../global/util/lang.utils";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TranslocoService} from "@ngneat/transloco";
import getCurrentLang = LangUtils.getCurrentLang;
import setLang = LangUtils.setLang;

@UntilDestroy()
@Component({
  selector: "lang-switcher",
  templateUrl: "./lang-switcher.component.html",
  styleUrls: ["./lang-switcher.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {

  readonly ctrl: FormControl<string> = new FormControl(getCurrentLang());
  readonly langList = LangUtils.getAvailableLangCodes();
  private readonly ts = inject(TranslocoService);

  constructor() {
    this.ctrl.valueChanges.pipe(untilDestroyed(this)).subscribe(v => {
      setLang(v);
      this.ts.setActiveLang(v);
      location.reload();
    });
  }

}

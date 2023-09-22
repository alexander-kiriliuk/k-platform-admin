import {ChangeDetectionStrategy, Component} from "@angular/core";
import {ThemeUtils} from "../../global/util/theme.utils";
import {TranslocoPipe} from "@ngneat/transloco";
import {NgClass} from "@angular/common";
import getCurrentTheme = ThemeUtils.getCurrentTheme;
import setTheme = ThemeUtils.setTheme;

@Component({
  selector: "theme-switcher",
  standalone: true,
  templateUrl: "./theme-switcher.component.html",
  styleUrls: ["./theme-switcher.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    NgClass
  ]
})
export class ThemeSwitcherComponent {

  get themeBtnClass() {
    return this.currentTheme === "dark" ? "pi-sun" : "pi-moon";
  }

  get currentTheme() {
    return getCurrentTheme();
  }

  toggleTheme() {
    const theme = this.currentTheme;
    theme === "dark" ? setTheme("light") : setTheme("dark");
  }

}

/*
 * Copyright 2023 Alexander Kiriliuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ChangeDetectionStrategy, Component} from "@angular/core";
import {ThemeUtils} from "@global/util/theme.utils";
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

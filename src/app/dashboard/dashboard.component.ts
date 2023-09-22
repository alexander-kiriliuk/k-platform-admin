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

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {MenuCommandHandler} from "../global/types";
import {Store} from "../modules/store/store";
import {AuthEvent} from "../auth/auth.event";
import {TranslationManager} from "../global/internationalization/translation-manager";
import {Dashboard} from "./dashboard.constants";
import {CurrentUser} from "../global/service/current-user";
import {DialogService} from "primeng/dynamicdialog";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {MenuTreeComponent} from "./menu/menu-tree.component";
import {PreloaderComponent} from "../modules/preloader/preloader.component";
import {LangSwitcherComponent} from "./lang-switcher/lang-switcher.component";
import {ThemeSwitcherComponent} from "./theme-switcher/theme-switcher.component";
import {MenuModule} from "primeng/menu";
import {AvatarModule} from "primeng/avatar";
import {MediaComponent} from "../modules/media/media.component";
import {TranslocoPipe} from "@ngneat/transloco";
import {PreloaderDirective} from "../modules/preloader/preloader.directive";


@Component({
  selector: "dashboard",
  standalone: true,
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    ScrollPanelModule,
    MenuTreeComponent,
    PreloaderComponent,
    LangSwitcherComponent,
    ThemeSwitcherComponent,
    MenuModule,
    AvatarModule,
    MediaComponent,
    NgIf,
    AsyncPipe,
    TranslocoPipe,
    PreloaderDirective
  ],
})
export class DashboardComponent implements MenuCommandHandler {

  menuModel: MenuItem[] = [];
  sidebarOverMode: boolean;
  readonly currentUser = inject(CurrentUser);
  private readonly store = inject(Store);
  private readonly tm = inject(TranslationManager);
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.tm.waitFor("dashboard").subscribe(() =>
      this.menuModel = Dashboard.createMenuModel(this, this.tm.translocoService)
    );
  }

  get preloaderChannel() {
    return Dashboard.MenuPrCn;
  }

  toggleSideBarMode() {
    this.sidebarOverMode = !this.sidebarOverMode;
  }

  onMenuCommand(event: MenuItemCommandEvent, id: string): void {
    switch (id) {
      case "profile":
        import("../profile/profile.component").then(c => {
          this.dialogService.open(c.ProfileComponent, {
            header: this.currentUser.fullName,
            resizable: true,
            draggable: true,
            modal: false,
            position: "topright"
          });
        });
        break;
      case "settings":
        // todo
        break;
      case "exit":
        this.store.emit(AuthEvent.Logout);
        break;
    }
  }

}

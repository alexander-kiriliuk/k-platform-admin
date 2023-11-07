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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from "@angular/core";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {MenuCommandHandler} from "../global/types";
import {Store} from "../modules/store/store";
import {AuthEvent} from "../auth/auth.event";
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
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {PreloaderDirective} from "../modules/preloader/preloader.directive";
import {DashboardEvent} from "./dashboard.event";


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
  title: string;
  readonly currentUser = inject(CurrentUser);
  private readonly store = inject(Store);
  private readonly ts = inject(TranslocoService);
  private readonly dialogService = inject(DialogService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.menuModel = Dashboard.createMenuModel(this, this.ts);
    this.store.on<string>(DashboardEvent.PatchHeader).subscribe(v => {
      this.title = v.payload;
      this.cdr.markForCheck();
    });
  }

  get preloaderChannel() {
    return Dashboard.MenuPreloaderCn;
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

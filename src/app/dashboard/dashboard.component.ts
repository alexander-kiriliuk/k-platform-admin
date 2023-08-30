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

import {Component} from "@angular/core";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {MenuCommandHandler} from "../global/types";
import {Store} from "../modules/store/store";
import {AuthEvent} from "../auth/auth.event";
import {TranslationManager} from "../global/internationalization/translation-manager";
import {Dashboard} from "./dashboard.constants";


@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements MenuCommandHandler {

  menuModel: MenuItem[] = [];
  sidebarOverMode: boolean;

  constructor(  // todo use inject anywhere
    private readonly store: Store,
    private readonly tm: TranslationManager) {
    this.tm.waitFor("dashboard").subscribe(() =>
      this.menuModel = Dashboard.createMenuModel(this, this.tm.translocoService)
    );
  }

  toggleSideBarMode() {
    this.sidebarOverMode = !this.sidebarOverMode;
  }

  onMenuCommand(event: MenuItemCommandEvent, id: string): void {
    switch (id) {
      case "exit":
        this.store.emit(AuthEvent.Logout);
        break;
    }
  }

}

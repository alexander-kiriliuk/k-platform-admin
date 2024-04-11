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
import {MenuCommandHandler, User} from "@global/types";
import {Store} from "@modules/store/store";
import {AuthEvent} from "@components/auth/auth.event";
import {Dashboard} from "./dashboard.constants";
import {CurrentUser} from "@global/service/current-user";
import {DialogService} from "primeng/dynamicdialog";
import {AsyncPipe, NgClass} from "@angular/common";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {MenuTreeComponent} from "./menu/menu-tree.component";
import {PreloaderComponent} from "@modules/preloader/preloader.component";
import {MenuModule} from "primeng/menu";
import {AvatarModule} from "primeng/avatar";
import {MediaComponent} from "@modules/media/media.component";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {PreloaderDirective} from "@modules/preloader/preloader.directive";
import {CurrentUserEvent, DashboardEvent} from "@global/events";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


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
    MenuModule,
    AvatarModule,
    MediaComponent,
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
  private readonly ar = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    this.menuModel = Dashboard.createMenuModel(this, this.ts);
    this.store.on<string>(DashboardEvent.PatchHeader).subscribe(v => {
      this.title = v.payload;
      this.cdr.markForCheck();
    });
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      if (this.isHomepage) {
        this.store.emit<string>(DashboardEvent.PatchHeader, "");
      }
    });
  }

  get isHomepage() {
    return this.router.url === "/";
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
        import("@components/profile/profile.component").then(c => {
          this.dialogService.open(c.ProfileComponent, {
            header: this.currentUser.fullName,
            resizable: true,
            draggable: true,
            modal: false,
            position: "topright"
          }).onClose.subscribe(data => {
            if (!data) {
              return;
            }
            this.store.emit<User>(CurrentUserEvent.Set, data);
          });
        });
        break;
      case "settings":
        import("./app-settings/app-settings.component").then(c => {
          this.dialogService.open(c.AppSettingsComponent, {
            header: this.ts.translate("dashboard.menu.settings"),
            resizable: true,
            draggable: true,
            modal: false,
            position: "topright"
          });
        });
        break;
      case "exit":
        this.store.emit(AuthEvent.Logout);
        break;
    }
  }

}

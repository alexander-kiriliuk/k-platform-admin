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

import {
AfterViewInit,
ChangeDetectionStrategy,
ChangeDetectorRef,
Component,
inject
} from "@angular/core";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MENU_STORE_KEY} from "./menu-tree.constants";
import {Category} from "@global/types";
import {AppService} from "@global/service/app.service";
import {finalize} from "rxjs";
import {Store} from "@modules/store/store";
import {PreloaderEvent} from "@modules/preloader/preloader.event";
import {Dashboard} from "../dashboard.constants";
import {NgClass, NgStyle, NgTemplateOutlet} from "@angular/common";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {StopPropagationDirective} from "@modules/events/stop-propagation.directive";


@Component({
  selector: "menu-tree",
  templateUrl: "./menu-tree.component.html",
  styleUrls: ["./menu-tree.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("toggleNode", [
      state("collapsed", style({height: "0", overflow: "hidden", opacity: 0})),
      state("expanded", style({height: "*", overflow: "hidden", opacity: 1})),
      transition("collapsed <=> expanded", animate("400ms ease-out")),
    ]),
  ],
  imports: [
    NgStyle,
    NgClass,
    NgTemplateOutlet,
    LocalizePipe,
    StopPropagationDirective
  ]
})
export class MenuTreeComponent implements AfterViewInit {

  openedNodes: { [k: number]: boolean } = {};
  data: Category<{ iconClass: string }>[] = [];
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly appService = inject(AppService);
  private readonly store = inject(Store);

  ngAfterViewInit(): void {
    this.appService.getMenu().pipe(finalize(() => {
      this.store.emit(PreloaderEvent.Hide, Dashboard.MenuPreloaderCn);
      const payload = localStorage.getItem(MENU_STORE_KEY);
      if (payload) {
        this.openedNodes = JSON.parse(payload);
      }
      this.cdr.markForCheck();
    })).subscribe(v => {
      this.data = v.children;
    });
  }

  openBranch(item: Category) {
    if (item.url) {
      this.router.navigateByUrl(item.url);
      return;
    }
    if (!item.children?.length) {
      return;
    }
    this.openedNodes[item.id] = true;
    this.syncNodes();
  }

  closeBranch(item: Category) {
    if (!this.openedNodes[item.id]) {
      this.openBranch(item);
      return;
    }
    delete this.openedNodes[item.id];
    this.syncNodes();
  }

  private syncNodes() {
    const payload = JSON.stringify(this.openedNodes);
    localStorage.setItem(MENU_STORE_KEY, payload);
  }

}

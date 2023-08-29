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

import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {Router} from "@angular/router";
import {UntilDestroy} from "@ngneat/until-destroy";
import {NavNodeData} from "./menu-tree.types";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MENU_STORE_KEY} from "./menu-tree.constants";

@UntilDestroy()
@Component({
  selector: "menu-tree",
  templateUrl: "./menu-tree.component.html",
  styleUrls: ["./menu-tree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("toggleNode", [
      state("collapsed", style({height: "0", overflow: "hidden", opacity: 0})),
      state("expanded", style({height: "*", overflow: "hidden", opacity: 1})),
      transition("collapsed <=> expanded", animate("400ms ease-out")),
    ]),
  ],
})
export class MenuTreeComponent implements AfterViewInit {
  openedNodes: { [k: number]: boolean } = {};
  data: NavNodeData[] = [
    {
      id: 1,
      name: "Apps",
      attrs: "pi pi-th-large"
    },
    {
      id: 2,
      name: "Games",
      attrs: "pi pi-th-large",
      children: [
        {
          id: 3,
          name: "XX",
          attrs: "pi pi-fw pi-list",
          url: "/apps/blog/list"
        },
        {
          id: 4,
          name: "X2",
          attrs: "pi pi-fw pi-pencil",
          url: "/apps/blog/list"
        }
      ]
    },
    {
      id: 5,
      name: "Other",
      attrs: "pi pi-th-large"
    },
    {
      id: 6,
      name: "Apps",
      attrs: "pi pi-th-large",
      children: [
        {
          id: 7,
          name: "Blog",
          attrs: "pi pi-fw pi-comment",
          children: [
            {
              id: 8,
              name: "List",
              attrs: "pi pi-fw pi-image",
              url: "/apps/blog/list"
            },
            {
              id: 9,
              name: "Detail",
              attrs: "pi pi-fw pi-list",
              url: "/apps/blog/list"
            },
            {

              id: 10, name: "Edit",
              attrs: "pi pi-fw pi-pencil",
              url: "/apps/blog/list"
            }
          ]
        }
      ]
    }
  ];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router) {
  }

  get currentUrl() {
    return decodeURIComponent(this.router.url);
  }

  ngAfterViewInit(): void {
    const payload = localStorage.getItem(MENU_STORE_KEY);
    if (!payload) {
      return;
    }
    this.openedNodes = JSON.parse(payload);
    this.cdr.detectChanges();
  }

  openBranch(item: NavNodeData) {
    if (!item.children?.length) {
      return;
    }
    this.openedNodes[item.id] = true;
    this.syncNodes();
  }

  closeBranch(item: NavNodeData) {
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

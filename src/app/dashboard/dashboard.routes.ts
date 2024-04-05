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

import {DashboardComponent} from "./dashboard.component";
import {Routes} from "@angular/router";

export const DashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "section/:target",
        loadComponent: () => import("@components/explorer/section/section.component")
          .then(m => m.SectionComponent)
      },
      {
        path: "object/:target/:id",
        loadComponent: () => import("@components/explorer/object/explorer-object.component")
          .then(m => m.ExplorerObjectComponent)
      },
      {
        path: "system/objects",
        loadComponent: () => import("@components/object/object.component")
          .then(m => m.ObjectComponent)
      },
      {
        path: "system/import-data",
        loadComponent: () => import("@components/xdb/xdb-import/xdb-import.component")
          .then(m => m.XdbImportComponent)
      },
      {
        path: "system/config",
        loadComponent: () => import("@components/config/config.component")
          .then(m => m.ConfigComponent)
      }
    ]
  }
];

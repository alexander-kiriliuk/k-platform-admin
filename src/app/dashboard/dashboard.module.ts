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

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {DashboardComponent} from "./dashboard.component";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {MenuTreeModule} from "./menu/menu-tree.module";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {provideTranslocoScope, TranslocoPipe} from "@ngneat/transloco";
import {ThemeSwitcherComponent} from "./theme-switcher/theme-switcher.component";
import {LangSwitcherComponent} from "./lang-switcher/lang-switcher.component";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {DialogService} from "primeng/dynamicdialog";
import {MediaUrlPipe} from "../modules/media/media-url.pipe";
import {MediaComponent} from "../modules/media/media.component";
import {PreloaderComponent} from "../modules/preloader/preloader.component";
import {PreloaderDirective} from "../modules/preloader/preloader.directive";


@NgModule({
  declarations: [
    DashboardComponent,
    ThemeSwitcherComponent,
    LangSwitcherComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ScrollPanelModule,
    MenuTreeModule,
    AvatarModule,
    MenuModule,
    TranslocoPipe,
    DropdownModule,
    ReactiveFormsModule,
    MediaUrlPipe,
    MediaComponent,
    PreloaderComponent,
    PreloaderDirective,
  ],
  providers: [
    provideTranslocoScope("dashboard"),
    DialogService
  ]
})
export class DashboardModule {
}

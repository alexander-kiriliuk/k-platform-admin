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

import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {DashboardEvent} from "../dashboard/dashboard.event";
import {Config} from "./config.constants";
import {TranslocoService} from "@ngneat/transloco";
import {Store} from "../modules/store/store";
import {ConfigService} from "./config.service";

@Component({
  selector: "config",
  standalone: true,
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigService],
  imports: []
})
export class ConfigComponent implements OnInit {

  private readonly ts = inject(TranslocoService);
  private readonly store = inject(Store);
  private readonly configService = inject(ConfigService);

  get preloaderChannel() {
    return Config.PreloaderCn;
  }

  ngOnInit(): void {
    this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("config.title"));
    this.getData();
  }

  getData(){
    this.configService.pageableData().subscribe(payload => {
      console.log(payload);
    });
  }

}

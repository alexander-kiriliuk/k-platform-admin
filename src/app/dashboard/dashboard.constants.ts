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

import {MenuCommandHandler} from "../global/types";
import {MenuItem} from "primeng/api";

export namespace Dashboard {

  export function createMenuModel(commandHandler: MenuCommandHandler): MenuItem[] {
    return [
      {
        label: "Профиль",
        icon: "pi pi-cog",
        command: e => commandHandler.onMenuCommand(e, "profile")
      },
      {
        label: "Найтройки",
        icon: "pi pi-wrench",
        command: e => commandHandler.onMenuCommand(e, "settings")
      },
      {
        label: "Выход",
        icon: "pi pi-sign-out",
        command: e => commandHandler.onMenuCommand(e, "exit")
      }
    ];
  }

}

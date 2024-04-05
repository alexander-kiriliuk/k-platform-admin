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
import {
AbstractExplorerActionRenderer
} from "@components/explorer/renderer/default/abstract-explorer-action-renderer";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {DialogService} from "primeng/dynamicdialog";
import {TranslocoService} from "@ngneat/transloco";
import {Router} from "@angular/router";
import {Media} from "@modules/media/media.types";

@Component({
  selector: "create-media-action-renderer",
  standalone: true,
  templateUrl: "./create-media-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
  ],
})
export class CreateMediaActionRendererComponent extends AbstractExplorerActionRenderer {

  private readonly dialogService = inject(DialogService);
  private readonly ts = inject(TranslocoService);
  private readonly router = inject(Router);

  createMedia() {
    import("./dialog/create-media-action-dialog.component").then(m => {
      this.dialogService.open(m.CreateMediaActionDialogComponent, {
        header: this.ts.translate("media.dialog.title"),
        modal: true,
        position: "top",
      }).onClose.subscribe((media: Media) => {
        if (!media) {
          return;
        }
        this.router.navigate([`/object/media/${media.id}`]);
      });
    });
  }

}

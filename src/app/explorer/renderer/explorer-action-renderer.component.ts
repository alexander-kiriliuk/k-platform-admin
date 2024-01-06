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
ChangeDetectionStrategy,
Component,
inject,
Input,
OnInit,
ViewContainerRef
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ExplorerAction, ExplorerActionRendererLoader, TargetData} from "../explorer.types";
import {AbstractExplorerActionRenderer} from "./default/abstract-explorer-action-renderer";
import {EXPLORER_ACTION_RENDERER} from "../explorer.constants";
import {FormGroup} from "@angular/forms";

@Component({
  selector: "explorer-action-renderer",
  standalone: true,
  template: "",
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerActionRendererComponent extends AbstractExplorerActionRenderer implements OnInit {

  @Input({required: true}) actions: ExplorerAction[];
  @Input({required: true}) override target: TargetData;
  @Input({required: true}) override data: unknown | unknown[];
  @Input() override entityForm: FormGroup;
  protected viewContainer = inject(ViewContainerRef);
  protected readonly renderers = inject(EXPLORER_ACTION_RENDERER);

  ngOnInit(): void {
    for (const action of this.actions) {
      const code = action.code;
      const renderer = this.renderers.find(v => v.code === code);
      if (!renderer) {
        console.warn(`Action renderer with code ${code} is not found`);
        continue;
      }
      this.drawComponent(renderer, action);
    }
  }

  private drawComponent(renderer: ExplorerActionRendererLoader, action: ExplorerAction) {
    renderer.load.then(component => {
      const ref = this.viewContainer.createComponent(component);
      ref.instance.target = this.target;
      ref.instance.data = this.data;
      ref.instance.entityForm = this.entityForm;
      ref.instance.action = action;
      ref.changeDetectorRef.detectChanges();
    });
  }

}

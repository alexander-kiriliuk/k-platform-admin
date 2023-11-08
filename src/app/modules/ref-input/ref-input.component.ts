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
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DialogService} from "primeng/dynamicdialog";
import {finalize} from "rxjs";
import {SectionDialogConfig, TargetData} from "../../explorer/explorer.types";
import {LocalizePipe} from "../locale/localize.pipe";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe} from "@ngneat/transloco";
import {PageableParams, PlainObject} from "../../global/types";
import {RefInputService} from "./ref-input.service";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {RefNamePipe} from "./ref-name.pipe";

@Component({
  selector: "ref-input",
  standalone: true,
  templateUrl: "./ref-input.component.html",
  styleUrls: ["./ref-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    RippleModule,
    TranslocoPipe,
    NgIf,
    RefNamePipe,
    NgTemplateOutlet,
    NgForOf
  ],
  providers: [
    RefInputService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RefInputComponent
    }
  ]
})
export class RefInputComponent implements ControlValueAccessor, OnInit {

  @Input({required: true}) target: string;
  @Input() multi: boolean;
  @Input() placeholder: string;
  @Input() params: PageableParams;
  @Output() changeData = new EventEmitter<unknown | unknown[]>();
  targetData: TargetData;
  disabled = false;
  targetLoadingState = true;
  private readonly refInputService = inject(RefInputService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly dialogService = inject(DialogService);
  private readonly cdr = inject(ChangeDetectorRef);
  private data: unknown | unknown[];

  get entity() {
    return this.data as PlainObject;
  }

  get entities() {
    return this.data as PlainObject[];
  }

  ngOnInit(): void {
    this.refInputService.getTarget(this.target, "section").pipe(finalize(() => {
      this.targetLoadingState = false;
      this.cdr.markForCheck();
    })).subscribe(payload => {
      this.targetData = payload;
    });
  }

  writeValue(res: unknown | unknown[]) {
    if (!res) {
      return;
    }
    this.data = res;
    this.cdr.markForCheck();
  }

  openSection() {
    import("../../explorer/section/section.component").then(m => {
      this.dialogService.open(m.SectionComponent, {
        header: this.localizePipe.transform(this.targetData.entity.name, this.targetData.entity.target) as string,
        data: {
          target: this.targetData, multi: this.multi, initialPageableParams: this.params
        } as SectionDialogConfig,
        modal: true,
        position: "top",
      }).onClose.subscribe((res: unknown | unknown[]) => {
        if (!res) {
          return;
        }
        if (this.multi) {
          if (!this.data) {
            this.data = [];
          }
          (res as PlainObject[]).forEach(r => {
            const pkKey = this.targetData.primaryColumn.property;
            const pkVal = r[pkKey];
            if (!this.entities.find(v => v[pkKey] === pkVal)) {
              (this.data as unknown[]).push(r);
            }
          });
        } else {
          this.data = res;
        }
        this.synchronize();
        this.cdr.markForCheck();
      });
    });
  }

  removeItem(entity: PlainObject) {
    if (!this.multi) {
      this.data = null;
      this.synchronize();
      return;
    }
    const idx = this.entities.indexOf(entity);
    this.entities.splice(idx, 1);
  }

  synchronize() {
    this.onChange(this.data);
    this.changeData.emit(this.data);
  }

  registerOnChange(onChange: () => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }

  onChange = (res: unknown | unknown[]) => {
  };

  onTouched = () => {
  };

}

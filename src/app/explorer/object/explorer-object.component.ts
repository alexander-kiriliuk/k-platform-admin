import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ExplorerService} from "../explorer.service";
import {forkJoin, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ToastData} from "../../global/types";
import {ToastEvent} from "../../global/events";
import {TranslocoService} from "@ngneat/transloco";
import {Store} from "../../modules/store/store";
import {DashboardEvent} from "../../dashboard/dashboard.event";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {ExplorerColumn, ExplorerTab, TargetData} from "../explorer.types";
import {ExplorerObjectRendererComponent} from "../renderer/explorer-object-renderer.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: "explorer-object",
  standalone: true,
  templateUrl: "./explorer-object.component.html",
  styleUrls: ["./explorer-object.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ExplorerObjectRendererComponent,
    NgForOf,
    NgIf
  ],
  providers: [
    ExplorerService,
    LocalizePipe
  ]
})
export class ExplorerObjectComponent implements OnInit {

  private readonly ar = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly explorerService = inject(ExplorerService);
  private readonly ts = inject(TranslocoService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly store = inject(Store);
  targetData: TargetData;
  entityData: { [k: string]: unknown };

  get id() {
    return this.ar.snapshot.params.id;
  }

  get target() {
    return this.ar.snapshot.params.target;
  }

  ngOnInit(): void {
    const targetObs = this.explorerService.getTarget(this.target, "object");
    const entityObs = this.explorerService.getEntity<{ [k: string]: unknown }>(this.target, this.id);
    forkJoin([targetObs, entityObs]).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(([target, entity]) => {
      const tabs: ExplorerTab[] = [];
      const outOfTabsColumns: ExplorerColumn[] = [];
      for (const col of target.entity.columns) {
        if (!col.tab) {
          outOfTabsColumns.push(col);
          continue;
        }
        if (tabs.find(t => t.id === col.tab?.id)) {
          continue;
        }
        tabs.push(col.tab);
      }
      let title = this.localizePipe.transform(target.entity.name, target.entity.target) as string;
      title += ` #${entity[target.primaryColumn.property]}`;
      this.store.emit<string>(DashboardEvent.PatchHeader, title);
      this.targetData = target;
      this.entityData = entity;
      console.log("Tabs:", tabs);
      console.log("OutOfTabsColumns:", outOfTabsColumns);
      // todo create form controls
      // todo create tabs UI
      this.cdr.markForCheck();
    });
  }

}
